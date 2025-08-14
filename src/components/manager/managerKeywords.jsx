import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteKeywordThunk, getKeywordThunk, postKeywordThunk, putKeywordThunk } from '../../features/keywordSlice'
import '../../styles/managerKeywords.css'

const ManagerKeywords = () => {
   const [keyword, setKeyword] = useState('')
   const [selected, setSelected] = useState('')
   const dispatch = useDispatch()
   const { keywords, loading, error } = useSelector((state) => state.keywords)

   useEffect(() => {
      dispatch(getKeywordThunk())
   }, [dispatch])

   const onClickAdd = () => {
      if (!keyword.trim()) {
         alert('키워드가 비어있어요.')
         return
      }

      dispatch(postKeywordThunk(keyword))
         .unwrap()
         .then(() => {
            dispatch(getKeywordThunk())
         })
         .catch((error) => {
            alert(`키워드 등록 실패: ${error}`)
         })
      setKeyword('')
   }

   const onChangeSelect = (value) => {
      const selectedKeywordName = value
      const selectedKeyword = keywords?.keywords?.find((item) => item.name === selectedKeywordName)

      if (selectedKeyword) {
         setSelected(selectedKeyword.id)
         setKeyword(selectedKeyword.name)
      } else {
         setSelected(null)
         setKeyword('')
      }
   }

   const onClickEdit = () => {
      if (!keyword.trim()) {
         alert('비어있어요')
         return
      }
      const id = selected
      const name = keyword

      dispatch(putKeywordThunk({ id, name }))
         .unwrap()
         .then(() => {
            dispatch(getKeywordThunk())
            setKeyword('')
            setSelected('')
         })
         .catch((error) => {
            alert(`키워드 수정 실패: ${error}`)
         })
   }

   const onclickDelete = () => {
      const id = selected

      dispatch(deleteKeywordThunk(id))
         .unwrap()
         .then(() => {
            dispatch(getKeywordThunk())
            setKeyword('')
            setSelected('')
         })
         .catch((error) => {
            alert('키워드 수정 실패: ', error)
         })
   }

   const onKeydownAdd = (e) => {
      if (e.key === 'Enter') onClickAdd()
   }

   return (
      <div>
         {!loading ? (
            <>
               <div>
                  <div style={{ marginBottom: '35px' }}>
                     <span className="managerKeywordsTitle">키워드</span>
                     <span className="managerKeywordsTitleBetween"> </span>
                     <span className="managerKeywordsSubtitle">Keywords</span>
                  </div>
                  <select style={{ marginBottom: '35px' }} className="managerKeywordsSelectKeyword managerKeywordsSelect" onChange={(e) => onChangeSelect(e.target.value)}>
                     <option value={''}>현재 키워드</option>
                     {keywords?.keywords?.map((keyword) => (
                        <option key={keyword.id} value={keyword.name}>
                           {keyword.name}
                        </option>
                     ))}
                  </select>
               </div>
               {selected ? (
                  <>
                     <div style={{ marginBottom: '35px' }}>
                        <span className="managerKeywordsTitle">수정할 키워드</span>
                        <span className="managerKeywordsTitleBetween"> </span>
                        <span className="managerKeywordsSubtitle">Edit keyword</span>
                     </div>
                     <input style={{ marginBottom: '35px' }} className="managerKeywordsSelectKeyword" value={keyword} type="text" placeholder="수정할 키워드를 입력해주세요." onChange={(e) => setKeyword(e.target.value)}></input>
                     <button style={{ marginBottom: '35px' }} className="managerKeywordsEdit" onClick={onClickEdit}>
                        수정하기
                     </button>
                     <button className="managerKeywordsEdit" onClick={onclickDelete}>
                        삭제하기
                     </button>
                  </>
               ) : (
                  <>
                     <div style={{ marginBottom: '35px' }}>
                        <span className="managerKeywordsTitle">추가할 키워드</span>
                        <span className="managerKeywordsTitleBetween"> </span>
                        <span className="managerKeywordsSubtitle">Add keyword</span>
                     </div>
                     <input style={{ marginBottom: '35px' }} className="managerKeywordsSelectKeyword" value={keyword} type="text" placeholder="추가할 키워드를 입력해주세요." onKeyDown={(e) => onKeydownAdd(e)} onChange={(e) => setKeyword(e.target.value)}></input>
                     <button className="managerKeywordsSave" onClick={onClickAdd}>
                        저장하기
                     </button>
                  </>
               )}
            </>
         ) : (
            <>로딩중</>
         )}
      </div>
   )
}
export default ManagerKeywords
