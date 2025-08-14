import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CloudUpload, X, Save } from 'lucide-react'
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
   const { rentalItemDetail } = useSelector((state) => state.rental)

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
   })

   // 이미지 관리를 위한 새로운 상태
   const [imageList, setImageList] = useState([]) // 기존 이미지와 새 이미지를 모두 포함
   const [deleteImages, setDeleteImages] = useState([]) // 삭제할 기존 이미지의 ID 목록
   const [formErrors, setFormErrors] = useState({})

   useEffect(() => {
      const loadData = async () => {
         setInitialLoading(true)
         try {
            await Promise.all([dispatch(getKeywordThunk()), dispatch(fetchRentalItem(id))])
         } catch (error) {
            console.error('데이터 로드 오류:', error)
            setError(error.message || '데이터 로드 중 오류가 발생했습니다.')
         } finally {
            setInitialLoading(false)
         }
      }

      loadData()
   }, [dispatch, id])

   // 렌탈 상품 데이터가 로드되면 폼 데이터 및 이미지 리스트 설정
   useEffect(() => {
      if (rentalItemDetail) {
         const existingKeywords = rentalItemDetail.ItemKeywords?.map((ik) => ik.Keyword.name) || []

         setFormData({
            rentalItemNm: rentalItemDetail.rentalItemNm || '',
            oneDayPrice: rentalItemDetail.oneDayPrice || '',
            quantity: rentalItemDetail.quantity || '',
            rentalDetail: rentalItemDetail.rentalDetail || '',
            rentalStatus: rentalItemDetail.rentalStatus || 'Y',
            keywords: existingKeywords,
         })

         // 기존 이미지들을 imageList에 설정
         const existingImgs =
            rentalItemDetail.rentalImgs?.map((img) => ({
               id: img.id,
               url: (() => {
                  const rawPath = img.imgUrl.replace(/\\/g, '/')
                  const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                  const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
                  return `${baseURL}/${cleanPath}`
               })(),
               isExisting: true, // 기존 이미지임을 나타냄
            })) || []

         setImageList(existingImgs)
         setDeleteImages([])
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
      const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)

      if (imageList.length + validFiles.length > 5) {
         alert('최대 5개의 이미지만 업로드할 수 있습니다.')
         return
      }

      const newImages = validFiles.map((file) => ({
         id: null, // 새 이미지에는 ID가 없음
         url: URL.createObjectURL(file),
         isExisting: false,
         file: file, // 파일 객체를 보관
      }))

      setImageList((prev) => [...prev, ...newImages])
      e.target.value = '' // 파일 입력 필드 초기화
   }

   const handleImageRemove = (index) => {
      const imageToRemove = imageList[index]

      // 기존 이미지라면 삭제 목록에 ID를 추가
      if (imageToRemove.isExisting) {
         setDeleteImages((prev) => [...prev, imageToRemove.id])
      } else {
         // 새 이미지라면 URL.revokeObjectURL로 메모리 해제
         URL.revokeObjectURL(imageToRemove.url)
      }

      // 이미지 리스트에서 제거
      setImageList((prev) => prev.filter((_, i) => i !== index))
   }

   const validateForm = () => {
      const errors = {}
      if (!formData.rentalItemNm.trim()) errors.rentalItemNm = '렌탈 상품명을 입력해주세요.'
      const priceNumber = Number(formData.oneDayPrice)
      if (!priceNumber || priceNumber <= 0) errors.oneDayPrice = '올바른 일일 렌탈가격을 입력해주세요.'
      const quantityNumber = Number(formData.quantity)
      if (quantityNumber === undefined || quantityNumber < 0) errors.quantity = '올바른 재고 수량을 입력해주세요.'
      setFormErrors(errors)
      return Object.keys(errors).length === 0
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateForm()) return

      setLoading(true)
      setError('')

      try {
         const formDataToSend = new FormData()

         formDataToSend.append('rentalItemNm', formData.rentalItemNm)
         formDataToSend.append('oneDayPrice', formData.oneDayPrice)
         formDataToSend.append('quantity', formData.quantity)
         formDataToSend.append('rentalDetail', formData.rentalDetail)
         formDataToSend.append('rentalStatus', formData.rentalStatus)
         formDataToSend.append('keywords', formData.keywords.join(','))
         formDataToSend.append('deleteImages', JSON.stringify(deleteImages))

         // 새로 추가된 이미지만 FormData에 추가
         const newImagesToUpload = imageList.filter((img) => !img.isExisting).map((img) => img.file)
         if (newImagesToUpload.length > 0) {
            newImagesToUpload.forEach((file) => {
               formDataToSend.append('img', file)
            })
         }

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

   if (initialLoading) {
      return (
         <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
         </Container>
      )
   }

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
            <Box display="flex" alignItems="center" className="rental-create-header">
               <IconButton onClick={handleBack}>
                  <ArrowLeft />
               </IconButton>
               <Typography className="rental-create-title">렌탈 상품 수정</Typography>
            </Box>

            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            <Paper className="rental-create-paper">
               <form onSubmit={handleSubmit}>
                  <div className="form-section-card">
                     <div className="section-header">상품명</div>
                     <div className="section-description">렌탈 상품의 이름을 입력해주세요.</div>
                     <div className="section-content">
                        <TextField fullWidth name="rentalItemNm" value={formData.rentalItemNm} onChange={handleInputChange} error={!!formErrors.rentalItemNm} helperText={formErrors.rentalItemNm} placeholder="렌탈 상품명을 입력하세요" variant="outlined" />
                     </div>
                  </div>

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

                  <div className="image-upload-container">
                     <div className="image-upload-header">
                        <div>
                           <div className="image-upload-title">이미지 업로드</div>
                           <div className="image-upload-subtitle">(최대 5개까지 가능, 첫 이미지가 대표 이미지가 됩니다.)</div>
                        </div>
                     </div>
                     <div className="image-grid-container">
                        {[...imageList, ...Array(5 - imageList.length).fill(null)].map((img, index) => (
                           <div key={index} className="image-preview-item">
                              {img ? (
                                 <>
                                    <img src={img.url} alt={`preview-${index}`} />
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
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} multiple={true} />
                                    <CloudUpload />
                                    <div className="image-placeholder-text">이미지</div>
                                 </label>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

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

                  <div className="description-section">
                     <TextField fullWidth name="rentalDetail" value={formData.rentalDetail} onChange={handleInputChange} multiline rows={6} placeholder="상품의 특징, 사용법, 주의사항 등을 입력해주세요." variant="outlined" />
                     <div className="description-divider"></div>
                  </div>

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
