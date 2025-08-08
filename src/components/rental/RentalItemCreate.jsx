import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CloudUpload, X, Save, AlertCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'

const RentalItemCreate = ({ onCreateSubmit }) => {
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   const [formData, setFormData] = useState({
      rentalItemNm: '',
      oneDayPrice: '',
      quantity: '',
      rentalDetail: '',
      rentalStatus: 'Y',
      keywords: '',
      images: [],
   })

   const [imagePreviews, setImagePreviews] = useState([])
   const [formErrors, setFormErrors] = useState({})

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
         setError('렌탈 상품 등록에 실패했습니다.')
      } finally {
         setLoading(false)
      }
   }

   const handleBack = () => {
      navigate(-1)
   }

   const handleReset = () => {
      setFormData({
         rentalItemNm: '',
         oneDayPrice: '',
         quantity: '',
         rentalDetail: '',
         rentalStatus: 'Y',
         keywords: '',
         images: [],
      })
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
      setImagePreviews([])
      setFormErrors({})
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-4xl mx-auto px-4">
            {/* 헤더 */}
            <div className="flex items-center mb-8">
               <button onClick={handleBack} className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm border mr-4 hover:bg-gray-50 transition-colors">
                  <ArrowLeft size={20} />
               </button>
               <h1 className="text-2xl font-bold text-gray-900">렌탈 상품 등록</h1>
            </div>

            {/* 에러 메시지 */}
            {error && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center text-red-700">
                  <AlertCircle size={20} className="mr-2" />
                  {error}
               </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-8">
               <form onSubmit={handleSubmit}>
                  {/* 상품명 섹션 */}
                  <div className="mb-8">
                     <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">상품명</h3>
                        <p className="text-sm text-gray-600 mt-1">렌탈 상품의 이름을 입력해주세요.</p>
                     </div>
                     <input
                        type="text"
                        name="rentalItemNm"
                        value={formData.rentalItemNm}
                        onChange={handleInputChange}
                        placeholder="렌탈 상품명을 입력하세요"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.rentalItemNm ? 'border-red-500' : 'border-gray-300'}`}
                     />
                     {formErrors.rentalItemNm && <p className="text-red-500 text-sm mt-1">{formErrors.rentalItemNm}</p>}
                  </div>

                  {/* 가격 및 재고 섹션 */}
                  <div className="mb-8">
                     <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">가격 및 재고</h3>
                        <p className="text-sm text-gray-600 mt-1">일일 렌탈 가격과 재고 수량을 입력해주세요.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">일일 렌탈가격</label>
                           <div className="relative">
                              <input
                                 type="number"
                                 name="oneDayPrice"
                                 value={formData.oneDayPrice}
                                 onChange={handleInputChange}
                                 placeholder="0"
                                 className={`w-full px-4 py-3 border rounded-lg pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.oneDayPrice ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              <span className="absolute right-3 top-3 text-gray-500">원</span>
                           </div>
                           {formErrors.oneDayPrice && <p className="text-red-500 text-sm mt-1">{formErrors.oneDayPrice}</p>}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">재고 수량</label>
                           <div className="relative">
                              <input
                                 type="number"
                                 name="quantity"
                                 value={formData.quantity}
                                 onChange={handleInputChange}
                                 placeholder="0"
                                 className={`w-full px-4 py-3 border rounded-lg pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              <span className="absolute right-3 top-3 text-gray-500">개</span>
                           </div>
                           {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
                        </div>
                     </div>
                  </div>

                  {/* 이미지 업로드 섹션 */}
                  <div className="mb-8">
                     <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">이미지 업로드</h3>
                        <p className="text-sm text-gray-600 mt-1">최대 5개까지 가능, 첫 이미지가 대표 이미지가 됩니다.</p>
                     </div>
                     <div className="grid grid-cols-5 gap-4">
                        {[0, 1, 2, 3, 4].map((index) => (
                           <div key={index} className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                              {imagePreviews[index] ? (
                                 <>
                                    <img src={imagePreviews[index]} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleImageRemove(index)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                                       <X size={14} />
                                    </button>
                                 </>
                              ) : (
                                 <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple={index === 0} />
                                    <CloudUpload size={24} className="text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">이미지</span>
                                 </label>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 키워드 섹션 */}
                  <div className="mb-8">
                     <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">키워드</h3>
                        <p className="text-sm text-gray-600 mt-1">검색에 도움이 되는 키워드를 쉼표(,)로 구분하여 입력해주세요.</p>
                     </div>
                     <input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="예: 캠핑, 텐트, 아웃도어" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                     <p className="text-xs text-gray-500 mt-1">키워드는 쉼표(,)로 구분해서 입력하세요</p>
                  </div>

                  {/* 상세설명 섹션 */}
                  <div className="mb-8">
                     <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">상세 설명</h3>
                        <p className="text-sm text-gray-600 mt-1">렌탈 상품에 대한 자세한 설명을 입력해주세요.</p>
                     </div>
                     <textarea
                        name="rentalDetail"
                        value={formData.rentalDetail}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="상품의 특징, 사용법, 주의사항 등을 입력해주세요."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                     />
                  </div>

                  {/* 렌탈 상태 섹션 */}
                  <div className="mb-8">
                     <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">렌탈 상태</h3>
                     </div>
                     <select name="rentalStatus" value={formData.rentalStatus} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                        <option value="Y">렌탈 가능</option>
                        <option value="N">렌탈 중단</option>
                     </select>
                  </div>

                  {/* 버튼 섹션 */}
                  <div className="flex gap-4 justify-center pt-6 border-t">
                     <button type="submit" disabled={loading} className="px-12 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center">
                        {loading ? (
                           <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              등록 중...
                           </>
                        ) : (
                           <>
                              <Save size={18} className="mr-2" />
                              렌탈 상품 등록
                           </>
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default RentalItemCreate
