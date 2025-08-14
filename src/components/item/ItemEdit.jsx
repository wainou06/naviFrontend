import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { fetchItem, updateItem } from '../../features/itemsSlice'
import { Container, Box, IconButton, Alert, Paper, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Typography } from '@mui/material'
import styles from '../../styles/itemCreate.module.css'

const ItemEdit = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()
   const { currentItem, loading, error } = useSelector((state) => state.items)

   const [formData, setFormData] = useState({
      name: '',
      price: '',
      content: '',
      status: 'available',
      keywords: [],
      images: [], // 새로 추가할 이미지만 저장
   })

   const [imageList, setImageList] = useState([]) // { id, url, isExisting, file? }
   const [formErrors, setFormErrors] = useState({})
   const [deleteImages, setDeleteImages] = useState([])

   useEffect(() => {
      if (id) {
         dispatch(fetchItem(id))
      }
   }, [dispatch, id])

   useEffect(() => {
      if (currentItem) {
         setFormData({
            name: currentItem.itemNm,
            price: currentItem.price,
            content: currentItem.itemDetail,
            status: currentItem.itemSellStatus?.toLowerCase(),
            keywords: currentItem.keywords || [],
            images: [],
         })

         // 기존 이미지들을 imageList에 설정
         const existingImages =
            currentItem.imgs?.map((img) => ({
               id: img.id,
               url: (() => {
                  const rawPath = img.imgUrl.replace(/\\/g, '/')
                  const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                  const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
                  return `${baseURL}/${cleanPath}`
               })(),
               isExisting: true,
               originalData: img, // 원본 이미지 데이터 보관
            })) || []

         setImageList(existingImages)
         setDeleteImages([]) // 삭제 목록 초기화
      }
   }, [currentItem])

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
      const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)

      // 현재 이미지 개수 확인
      const currentActiveImages = imageList.filter((img) => !deleteImages.includes(img.id))
      if (currentActiveImages.length + validFiles.length > 5) {
         alert('최대 5개의 이미지만 업로드할 수 있습니다.')
         return
      }

      // 새 이미지들을 imageList에 추가
      const newImages = validFiles.map((file, index) => ({
         id: `new_${Date.now()}_${index}`,
         url: URL.createObjectURL(file),
         isExisting: false,
         file: file,
      }))

      setImageList((prev) => [...prev, ...newImages])
      setFormData((prev) => ({
         ...prev,
         images: [...prev.images, ...validFiles],
      }))
   }

   const handleImageRemove = (imageId) => {
      const imageToRemove = imageList.find((img) => img.id === imageId)

      if (!imageToRemove) return

      if (imageToRemove.isExisting) {
         const originalImageId = currentItem?.imgs?.find((img, index) => imageToRemove.id === img.id || imageToRemove.id === `existing_${index}`)?.id

         if (originalImageId) {
            setDeleteImages((prev) => [...prev, originalImageId])
         }
      } else {
         setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((file) => file !== imageToRemove.file),
         }))
         URL.revokeObjectURL(imageToRemove.url)
      }
      setImageList((prev) => prev.filter((img) => img.id !== imageId))
   }

   const validateForm = () => {
      const errors = {}

      if (!formData.name.trim()) {
         errors.name = '상품명을 입력해주세요.'
      }

      if (!formData.price || formData.price <= 0) {
         errors.price = '올바른 가격을 입력해주세요.'
      }

      setFormErrors(errors)
      return Object.keys(errors).length === 0
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!validateForm()) return

      try {
         await dispatch(
            updateItem({
               id,
               itemData: {
                  ...formData,
                  deleteImages: deleteImages, // 실제 이미지 ID들만 들어있음
               },
            })
         ).unwrap()
         // alert('상품이 성공적으로 수정되었습니다.')
         navigate(`/items/detail/${id}`)
      } catch (error) {
         console.error('상품 수정 실패:', error)
      }
   }

   // 현재 표시할 이미지들 (삭제 예정인 것 제외)
   const displayImages = imageList.filter((img) => !deleteImages.includes(img.id))

   return (
      <div className={styles.itemCreateContainer}>
         <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 헤더 */}
            <Box display="flex" alignItems="center" className={styles.itemCreateHeader}>
               <IconButton onClick={() => navigate('/items/list')}>
                  <ArrowLeft />
                  <Typography className={styles.itemCreateTitle}>상품 수정</Typography>
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
                  {/* 제목 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>제목</div>
                     <div className={styles.sectionContent}>
                        <TextField fullWidth name="name" value={formData.name} onChange={handleInputChange} error={!!formErrors.name} helperText={formErrors.name} placeholder="상품명을 입력하세요" variant="outlined" />
                     </div>
                  </div>

                  {/* 가격 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>가격</div>
                     <div className={styles.sectionContent}>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <TextField fullWidth label="가격" name="price" type="number" value={formData.price} onChange={handleInputChange} error={!!formErrors.price} helperText={formErrors.price} InputProps={{ endAdornment: '원' }} />
                           </Grid>
                        </Grid>
                     </div>
                  </div>

                  {/* 이미지 업로드 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>이미지</div>
                     <div className={styles.sectionContent}>
                        <div className={styles.imageGridContainer}>
                           {displayImages.map((image) => (
                              <div key={image.id} className={styles.imagePreviewItem}>
                                 <img src={image.url} alt={`preview-${image.id}`} />
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
                                    onClick={() => handleImageRemove(image.id)}
                                 >
                                    <X size={16} />
                                 </IconButton>
                              </div>
                           ))}
                        </div>

                        {displayImages.length < 5 && (
                           <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                              이미지 추가
                              <input type="file" accept="image/*" hidden multiple onChange={handleImageUpload} />
                           </Button>
                        )}
                     </div>
                  </div>

                  {/* 상세 설명 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>상세 설명</div>
                     <div className={styles.sectionContent}>
                        <TextField fullWidth name="content" value={formData.content} onChange={handleInputChange} multiline rows={6} placeholder="상세 설명을 작성해주세요." variant="outlined" />
                     </div>
                  </div>

                  {/* 상태 */}
                  <div className={styles.formSectionCard}>
                     <div className={styles.sectionHeader}>판매 상태</div>
                     <div className={styles.sectionContent}>
                        <FormControl fullWidth>
                           <InputLabel>판매상태</InputLabel>
                           <Select name="status" value={formData.status} label="판매상태" onChange={handleInputChange}>
                              <MenuItem value="sell">판매중</MenuItem>
                              <MenuItem value="reservation">예약중</MenuItem>
                              <MenuItem value="sold_out">판매완료</MenuItem>
                           </Select>
                        </FormControl>
                     </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className={styles.buttonSection}>
                     <Box display="flex" gap={2}>
                        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <Save />} disabled={loading} sx={{ flex: 2 }}>
                           {loading ? '수정 중...' : '상품 수정'}
                        </Button>
                     </Box>
                  </div>
               </form>
            </Paper>
         </Container>
      </div>
   )
}

export default ItemEdit
