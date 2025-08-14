import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CloudUpload, Save, X } from 'lucide-react'
import { getKeywordThunk } from '../../features/keywordSlice'
import { Container, Box, IconButton, Alert, Paper, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Chip, Typography } from '@mui/material'
import styles from '../../styles/itemCreate.module.css'

const ItemCreate = ({ onCreateSubmit }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { createLoading, error } = useSelector((state) => state.items)
   const { keywords } = useSelector((state) => state.keywords)

   const [formData, setFormData] = useState({
      name: '',
      price: '',
      stock: '',
      content: '',
      status: 'available',
      keywords: [],
      images: [],
   })

   const [imagePreviews, setImagePreviews] = useState([])
   const [formErrors, setFormErrors] = useState({})

   useEffect(() => {
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
      if (!formData.name.trim()) {
         errors.name = '상품명을 입력해주세요.'
      }
      const priceNumber = Number(formData.price)
      if (!priceNumber || priceNumber <= 0) {
         errors.price = '올바른 가격을 입력해주세요.'
      }
      setFormErrors(errors)
      console.log('Errors:', errors)
      return Object.keys(errors).length === 0
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateForm()) {
         return
      }
      try {
         await onCreateSubmit(formData)
         alert('상품이 성공적으로 등록되었습니다.')
      } catch (error) {
         console.error('상품 등록 실패:', error)
      }
   }

   const handleKeywordChange = (event) => {
      const { value } = event.target
      setFormData((prev) => ({
         ...prev,
         keywords: value,
      }))
   }

   return (
      <div className={styles.itemCreateContainer}>
         <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 헤더 */}
            <Box display="flex" alignItems="center" className={styles.itemCreateHeader}>
               <IconButton onClick={() => navigate('/items/list')}>
                  <ArrowLeft />
                  <Typography className={styles.itemCreateTitle}>상품 등록</Typography>
               </IconButton>
            </Box>

            {/* 에러 메시지 */}
            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            <Paper className={styles.itemCreatePaper}>
               <form onSubmit={handleSubmit}>
                  {/* 제목 섹션 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>제목</div>
                     <div className={styles.sectionDescription}>제목으로 상품명을 작성해주세요.</div>
                     <div className={styles.sectionContent}>
                        <TextField fullWidth name="name" value={formData.name} onChange={handleInputChange} error={!!formErrors.name} helperText={formErrors.name} placeholder="상품명을 입력하세요" variant="outlined" />
                     </div>
                  </div>

                  {/* 가격 섹션 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>가격</div>
                     <div className={styles.sectionContent}>
                        <Grid container spacing={2}>
                           <Grid item xs={15} sm={6}>
                              <TextField
                                 fullWidth
                                 label="상품 가격을 입력해주세요."
                                 name="price"
                                 type="number"
                                 value={formData.price}
                                 onChange={handleInputChange}
                                 error={!!formErrors.price}
                                 helperText={formErrors.price}
                                 InputProps={{
                                    endAdornment: '원',
                                 }}
                              />
                           </Grid>
                        </Grid>
                     </div>
                  </div>
                  {/* 이미지 업로드 섹션 */}
                  <div className={styles.imageUploadContainer}>
                     <div className={styles.imageUploadHeader}>
                        <div>
                           <div className={styles.imageUploadTitle}>이미지 업로드</div>
                           <div className={styles.imageUploadSubtitle}>(최대 5개까지 가능, 첫 이미지가 대표 이미지가 됩니다.)</div>
                        </div>
                     </div>
                     {/* 이미지 그리드 */}
                     <div className={styles.imageGridContainer}>
                        {[0, 1, 2, 3, 4].map((index) => (
                           <div key={index} className={styles.imagePreviewItem}>
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
                                 <label className={styles.imagePlaceholder}>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} multiple={index === 0} />
                                    <CloudUpload />
                                    <div className={styles.imagePlaceholderText}>이미지</div>
                                 </label>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* 키워드 선택 섹션 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>키워드 선택 ▼</div>
                     <div className={styles.sectionContent}>
                        {keywords?.keywords && keywords.keywords.length > 0 ? (
                           <FormControl fullWidth>
                              <InputLabel>키워드 선택</InputLabel>
                              <Select name="keywords" value={formData.keywords} multiple onChange={handleKeywordChange} renderValue={(selected) => selected.join(', ')}>
                                 {keywords.keywords.map((keyword) => (
                                    <MenuItem key={keyword.id} value={keyword.name}>
                                       <Chip label={keyword.name} />
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                        ) : (
                           <div style={{ textAlign: 'center', color: '#666', padding: '20px', fontStyle: 'italic' }}> 키워드가 존재하지 않습니다</div>
                        )}
                     </div>
                  </div>
                  {/* 상세설명 섹션 */}
                  <div className={styles.descriptionSection}>
                     <TextField fullWidth name="content" value={formData.content} onChange={handleInputChange} multiline rows={6} placeholder="상세 설명을 작성해주세요." variant="outlined" />
                     <div className={styles.descriptionDivider}></div>
                  </div>

                  {/* 판매상태 섹션 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionContent}>
                        <FormControl fullWidth>
                           <InputLabel>판매상태</InputLabel>
                           <Select name="status" value={formData.status} label="판매상태" onChange={handleInputChange}>
                              <MenuItem value="available">판매중</MenuItem>
                              <MenuItem value="reserved">예약중</MenuItem>
                              <MenuItem value="unavailable">판매완료</MenuItem>
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  {/* 버튼 섹션 */}
                  <div className={styles.buttonSection}>
                     <Box display="flex" gap={2}>
                        <Button type="submit" variant="contained" startIcon={createLoading ? <CircularProgress size={16} /> : <Save />} disabled={createLoading} sx={{ flex: 2 }}>
                           {createLoading ? '등록 중...' : '상품등록'}
                        </Button>
                     </Box>
                  </div>
               </form>
            </Paper>
         </Container>
      </div>
   )
}

export default ItemCreate
