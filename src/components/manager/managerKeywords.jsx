import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteKeywordThunk, getKeywordThunk, postKeywordThunk, putKeywordThunk } from '../../features/keywordSlice'

const ManagerKeywords = () => {
   const [keyword, setKeyword] = useState('')
   const [selected, setSelected] = useState('')
   const dispatch = useDispatch()
   const { keywords, loading } = useSelector((state) => state.keywords)

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
         .catch(() => {
            alert('키워드 등록 실패')
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
            alert('키워드 수정 실패: ', error)
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

   return (
      <div>
         {!loading ? (
            <>
               Keywords
               <br></br>
               <select onChange={(e) => onChangeSelect(e.target.value)}>
                  <option value={''}>키워드 추가하기</option>
                  {keywords?.keywords?.map((keyword) => (
                     <option key={keyword.id} value={keyword.name}>
                        {keyword.name}
                     </option>
                  ))}
               </select>
               <br></br>
               {selected ? (
                  <>
                     Edit keyword
                     <br></br>
                     <input value={keyword} type="text" placeholder="키워드 수정" onChange={(e) => setKeyword(e.target.value)}></input>
                     <button onClick={onClickEdit}>edit</button>
                     <button onClick={onclickDelete}>delete</button>
                  </>
               ) : (
                  <>
                     Add keyword
                     <br></br>
                     <input value={keyword} type="text" placeholder="키워드 추가" onChange={(e) => setKeyword(e.target.value)}></input>
                     <button onClick={onClickAdd}>add</button>
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
