import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CloudUpload, X, Save, AlertCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getKeywordThunk } from '../../features/keywordSlice'
import { fetchRentalItem, updateRentalItem } from '../../features/rentalSlice'
import { Container, Box, IconButton, Typography, Alert, Paper, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Chip } from '@mui/material'
import '../../styles/rentalItemCreate.css'

const RentalItemEdit = ({ onUpdateSubmit }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   const { keywords } = useSelector((state) => state.keywords)
   const { rentalItemDetail, loading: rentalLoading, error: rentalError } = useSelector((state) => state.rental)

   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [initialLoading, setInitialLoading] = useState(true)

   const [formData, setFormData] = useState({
      rentalItemNm: '',
      oneDayPrice: '',
      quantity: '',
      rentalDetail: '',
      rentalStatus: 'Y',
      keywords: [],
      images: [],
      deleteImages: [], // 삭제할 이미지 ID 목록
   })

   const [imagePreviews, setImagePreviews] = useState([])
   const [existingImages, setExistingImages] = useState([]) // 기존 이미지들
   const [formErrors, setFormErrors] = useState({})

   // 컴포넌트 마운트 시 데이터 로드
   useEffect(() => {
      const loadData = async () => {
         setInitialLoading(true)
         try {
            await Promise.all([dispatch(getKeywordThunk()), dispatch(fetchRentalItem(id))])
         } catch (error) {
            setError('데이터 로드 중 오류가 발생했습니다.')
         } finally {
            setInitialLoading(false)
         }
      }

      loadData()
   }, [dispatch, id])

   // 렌탈 상품 데이터가 로드되면 폼 데이터 설정
   useEffect(() => {
      if (rentalItemDetail) {
         const existingKeywords = rentalItemDetail.ItemKeywords?.map((ik) => ik.Keyword.name) || []
         const existingImgs = rentalItemDetail.rentalImgs || []

         setFormData({
            rentalItemNm: rentalItemDetail.rentalItemNm || '',
            oneDayPrice: rentalItemDetail.oneDayPrice || '',
            quantity: rentalItemDetail.quantity || '',
            rentalDetail: rentalItemDetail.rentalDetail || '',
            rentalStatus: rentalItemDetail.rentalStatus || 'Y',
            keywords: existingKeywords,
            images: [],
            deleteImages: [],
         })

         setExistingImages(existingImgs)

         // 기존 이미지들을 미리보기에 추가 - URL 처리 개선
         const processedImageUrls = existingImgs.map((img) => {
            const rawPath = img.imgUrl.replace(/\\/g, '/')
            const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
            const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
            return `${baseURL}/${cleanPath}`
         })

         setImagePreviews(processedImageUrls)
      }
   }, [rentalItemDetail])

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }))

      if (formErrors[name]) {
         setFormErrors((prev) => ({
            ...prev,
            [name]: '',
         }))
      }
   }

   const handleKeywordChange = (event) => {
      const { value } = event.target
      setFormData((prev) => ({
         ...prev,
         keywords: value,
      }))
   }

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      const validFiles = files.filter((file) => {
         return file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
      })

      const currentImageCount = existingImages.length - formData.deleteImages.length + formData.images.length
      if (currentImageCount + validFiles.length > 5) {
         alert('최대 5개의 이미지만 업로드할 수 있습니다.')
         return
      }

      const newImages = [...formData.images, ...validFiles]
      const newPreviews = [...imagePreviews]

      validFiles.forEach((file) => {
         newPreviews.push(URL.createObjectURL(file))
      })

      setFormData((prev) => ({
         ...prev,
         images: newImages,
      }))
      setImagePreviews(newPreviews)
   }

   const handleImageRemove = (index) => {
      const totalExistingImages = existingImages.length
      const deletedCount = formData.deleteImages.length
      const availableExistingImages = totalExistingImages - deletedCount

      if (index < availableExistingImages) {
         // 기존 이미지 삭제
         const actualIndex = formData.deleteImages.length + index
         if (actualIndex < existingImages.length) {
            const imageToDelete = existingImages[actualIndex]
            setFormData((prev) => ({
               ...prev,
               deleteImages: [...prev.deleteImages, imageToDelete.id],
            }))
         }
      } else {
         // 새로 추가된 이미지 삭제
         const newImageIndex = index - availableExistingImages
         const newImages = formData.images.filter((_, i) => i !== newImageIndex)

         setFormData((prev) => ({
            ...prev,
            images: newImages,
         }))
      }

      // 미리보기에서 제거
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      setImagePreviews(newPreviews)
   }

   const validateForm = () => {
      const errors = {}

      if (!formData.rentalItemNm.trim()) {
         errors.rentalItemNm = '렌탈 상품명을 입력해주세요.'
      }

      const priceNumber = Number(formData.oneDayPrice)
      if (!priceNumber || priceNumber <= 0) {
         errors.oneDayPrice = '올바른 일일 렌탈가격을 입력해주세요.'
      }

      const quantityNumber = Number(formData.quantity)
      if (quantityNumber === undefined || quantityNumber < 0) {
         errors.quantity = '올바른 재고 수량을 입력해주세요.'
      }

      setFormErrors(errors)
      return Object.keys(errors).length === 0
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateForm()) return

      setLoading(true)
      setError('')

      try {
         // FormData 객체 생성 (multipart/form-data로 전송하기 위해)
         const formDataToSend = new FormData()

         // 기본 필드들 추가
         formDataToSend.append('rentalItemNm', formData.rentalItemNm)
         formDataToSend.append('oneDayPrice', formData.oneDayPrice)
         formDataToSend.append('quantity', formData.quantity)
         formDataToSend.append('rentalDetail', formData.rentalDetail)
         formDataToSend.append('rentalStatus', formData.rentalStatus)
         formDataToSend.append('keywords', formData.keywords.join(','))

         // 삭제할 이미지 ID들 (배열이 비어있어도 안전하게 처리)
         if (formData.deleteImages && formData.deleteImages.length > 0) {
            formDataToSend.append('deleteImages', JSON.stringify(formData.deleteImages))
         } else {
            formDataToSend.append('deleteImages', JSON.stringify([]))
         }

         // 새로운 이미지 파일들 추가
         if (formData.images && formData.images.length > 0) {
            formData.images.forEach((file, index) => {
               formDataToSend.append('img', file)
            })
         }

         console.log('📝 수정할 데이터:')
         console.log('- 상품명:', formData.rentalItemNm)
         console.log('- 키워드:', formData.keywords)
         console.log('- 삭제할 이미지 ID:', formData.deleteImages)
         console.log('- 새 이미지 개수:', formData.images.length)

         if (onUpdateSubmit) {
            await onUpdateSubmit(formDataToSend)
         } else {
            await dispatch(updateRentalItem({ id, rentalItemData: formDataToSend })).unwrap()
            navigate('/rental/list')
         }
      } catch (error) {
         setError('렌탈 상품 수정에 실패했습니다.')
         console.error('수정 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   const handleBack = () => {
      navigate(-1)
   }

   // 초기 로딩 중
   if (initialLoading) {
      return (
         <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
         </Container>
      )
   }

   // 상품을 찾을 수 없는 경우
   if (!rentalItemDetail && !initialLoading) {
      return (
         <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="error">렌탈 상품을 찾을 수 없습니다.</Alert>
         </Container>
      )
   }

   return (
      <div className="rental-create-container">
         <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 헤더 */}
            <Box display="flex" alignItems="center" className="rental-create-header">
               <IconButton onClick={handleBack}>
                  <ArrowLeft />
               </IconButton>
               <Typography className="rental-create-title">렌탈 상품 수정</Typography>
            </Box>

            {/* 에러 메시지 */}
            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            <Paper className="rental-create-paper">
               <form onSubmit={handleSubmit}>
                  {/* 상품명 섹션 */}
                  <div className="form-section-card">
                     <div className="section-header">상품명</div>
                     <div className="section-description">렌탈 상품의 이름을 입력해주세요.</div>
                     <div className="section-content">
                        <TextField fullWidth name="rentalItemNm" value={formData.rentalItemNm} onChange={handleInputChange} error={!!formErrors.rentalItemNm} helperText={formErrors.rentalItemNm} placeholder="렌탈 상품명을 입력하세요" variant="outlined" />
                     </div>
                  </div>

                  {/* 가격 및 재고 섹션 */}
                  <div className="form-section-card">
                     <div className="section-header">가격 및 재고</div>
                     <div className="section-description">일일 렌탈 가격과 재고 수량을 입력해주세요.</div>
                     <div className="section-content">
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <TextField
                                 fullWidth
                                 label="일일 렌탈가격"
                                 name="oneDayPrice"
                                 type="number"
                                 value={formData.oneDayPrice}
                                 onChange={handleInputChange}
                                 error={!!formErrors.oneDayPrice}
                                 helperText={formErrors.oneDayPrice}
                                 InputProps={{
                                    endAdornment: '원',
                                 }}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <TextField
                                 fullWidth
                                 label="재고 수량"
                                 name="quantity"
                                 type="number"
                                 value={formData.quantity}
                                 onChange={handleInputChange}
                                 error={!!formErrors.quantity}
                                 helperText={formErrors.quantity}
                                 InputProps={{
                                    endAdornment: '개',
                                 }}
                              />
                           </Grid>
                        </Grid>
                     </div>
                  </div>

                  {/* 이미지 업로드 섹션 */}
                  <div className="image-upload-container">
                     <div className="image-upload-header">
                        <div>
                           <div className="image-upload-title">이미지 업로드</div>
                           <div className="image-upload-subtitle">(최대 5개까지 가능, 첫 이미지가 대표 이미지가 됩니다.)</div>
                        </div>
                     </div>

                     {/* 이미지 그리드 */}
                     <div className="image-grid-container">
                        {[0, 1, 2, 3, 4].map((index) => {
                           const isDeleted = index < existingImages.length && formData.deleteImages.includes(existingImages[index]?.id)

                           return (
                              <div key={index} className="image-preview-item">
                                 {imagePreviews[index] && !isDeleted ? (
                                    <>
                                       <img src={imagePreviews[index]} alt={`preview-${index}`} />
                                       <IconButton
                                          sx={{
                                             position: 'absolute',
                                             top: 4,
                                             right: 4,
                                             background: 'rgba(244, 67, 54, 0.8)',
                                             color: 'white',
                                             '&:hover': { background: 'rgba(244, 67, 54, 1)' },
                                          }}
                                          size="small"
                                          onClick={() => handleImageRemove(index)}
                                       >
                                          <X size={16} />
                                       </IconButton>
                                    </>
                                 ) : (
                                    <label className="image-placeholder">
                                       <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} multiple={index === imagePreviews.length} />
                                       <CloudUpload />
                                       <div className="image-placeholder-text">이미지</div>
                                    </label>
                                 )}
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  {/* 키워드 선택 섹션 */}
                  <div className="form-section-card">
                     <div className="section-header">키워드 선택 ▼</div>
                     <div className="section-description">검색에 도움이 되는 키워드를 선택해주세요.</div>
                     <div className="section-content">
                        <FormControl fullWidth>
                           <InputLabel>키워드 선택</InputLabel>
                           <Select name="keywords" value={formData.keywords} multiple onChange={handleKeywordChange} renderValue={(selected) => selected.join(', ')}>
                              {keywords?.keywords?.map((keyword) => (
                                 <MenuItem key={keyword.id} value={keyword.name}>
                                    <Chip label={keyword.name} />
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  {/* 상세설명 섹션 */}
                  <div className="description-section">
                     <TextField fullWidth name="rentalDetail" value={formData.rentalDetail} onChange={handleInputChange} multiline rows={6} placeholder="상품의 특징, 사용법, 주의사항 등을 입력해주세요." variant="outlined" />
                     <div className="description-divider"></div>
                  </div>

                  {/* 렌탈상태 섹션 */}
                  <div className="form-section-card">
                     <div className="section-content">
                        <FormControl fullWidth>
                           <InputLabel>렌탈상태</InputLabel>
                           <Select name="rentalStatus" value={formData.rentalStatus} label="렌탈상태" onChange={handleInputChange}>
                              <MenuItem value="Y">렌탈 가능</MenuItem>
                              <MenuItem value="N">렌탈 중단</MenuItem>
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  {/* 버튼 섹션 */}
                  <div className="button-section">
                     <Box display="flex" gap={2}>
                        <Button type="submit" startIcon={loading ? <CircularProgress size={16} /> : <Save />} disabled={loading} sx={{ flex: 2 }}>
                           {loading ? '수정 중...' : '렌탈 상품 수정'}
                        </Button>
                     </Box>
                  </div>
               </form>
            </Paper>
         </Container>
      </div>
   )
}

export default RentalItemEdit
