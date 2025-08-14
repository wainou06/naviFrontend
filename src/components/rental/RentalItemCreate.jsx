import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CloudUpload, X, Save, AlertCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getKeywordThunk } from '../../features/keywordSlice' // 키워드 가져오는 액션
import { Container, Box, IconButton, Typography, Alert, Paper, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Chip } from '@mui/material'
import '../../styles/rentalItemCreate.css'

const RentalItemCreate = ({ onCreateSubmit }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { keywords } = useSelector((state) => state.keywords)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   const [formData, setFormData] = useState({
      rentalItemNm: '',
      oneDayPrice: '',
      quantity: '',
      rentalDetail: '',
      rentalStatus: 'Y',
      keywords: [], // 문자열에서 배열로 변경
      images: [],
   })

   const [imagePreviews, setImagePreviews] = useState([])
   const [formErrors, setFormErrors] = useState({})

   useEffect(() => {
      // 컴포넌트가 마운트되면 키워드 목록을 가져옵니다.
      dispatch(getKeywordThunk())
   }, [dispatch])

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

      if (formData.images.length + validFiles.length > 5) {
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
      const newImages = formData.images.filter((_, i) => i !== index)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)

      URL.revokeObjectURL(imagePreviews[index])

      setFormData((prev) => ({
         ...prev,
         images: newImages,
      }))
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
         console.log('📝 등록할 데이터:', formData)
         await onCreateSubmit(formData)
         navigate('/rental/list')
      } catch (error) {
         console.error('렌탈 상품 등록 오류:', error)
         setError(error.message || '렌탈 상품 등록에 실패했습니다.')
      } finally {
         setLoading(false)
      }
   }

   const handleBack = () => {
      navigate(-1)
   }

   return (
      <div className="rental-create-container">
         <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 헤더 */}
            <Box display="flex" alignItems="center" className="rental-create-header">
               <IconButton onClick={handleBack}>
                  <ArrowLeft />
               </IconButton>
               <Typography className="rental-create-title">렌탈 상품 등록</Typography>
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
                        {[0, 1, 2, 3, 4].map((index) => (
                           <div key={index} className="image-preview-item">
                              {imagePreviews[index] ? (
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
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} multiple={index === 0} />
                                    <CloudUpload />
                                    <div className="image-placeholder-text">이미지</div>
                                 </label>
                              )}
                           </div>
                        ))}
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
                           {loading ? '등록 중...' : '렌탈 상품 등록'}
                        </Button>
                     </Box>
                  </div>
               </form>
            </Paper>
         </Container>
      </div>
   )
}

export default RentalItemCreate
