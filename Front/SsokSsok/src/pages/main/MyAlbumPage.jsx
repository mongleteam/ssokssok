// import React, { useEffect, useState } from "react";
// import BeeAnimation from "../../components/animations/BeeAnimation";
// import FlowerAnimation from "../../components/animations/FlowerAnimation";
// import Header from "../../components/Header";
// import MyAlbumBoard from "../../assets/images/mybookpicture.png"
// import AlbumBoard from "../../assets/images/wood_board_album.png"
// import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
// import './MyAlbumPage.css';
// import CustomAlert from "../../components/CustomAlert";
// import CustomConfirm from "../../components/CustomConfirm";
// const MyAlbumPage = () => {
//     const [alertMessage, setAlertMessage] = useState("");
//     const [showAlert, setShowAlert] = useState(false);  
//     const [albumData, setAlbumData] = useState([])
//     const [selectedImages, setSelectedImages] = useState([]); // 삭제할 이미지 선택
//     const [previewImage, setPreviewImage] = useState(null);    // 모달용 이미지
//     useEffect(() => {
//         getAlbumApi()
//         .then((res) => {
//             console.log(res.data.data)
//             setAlbumData(res.data.data)
//         })
//     }, [])

//     const deleteSelectedImages = async () => {
//       if (selectedImages.length === 0) {
//         setAlertMessage("삭제할 사진을 선택해주세요!");
//         setShowAlert(true);
//         return;
//       }
//       try {
//         await deleteAlbumApi({ myalbumPks: selectedImages });
      
//         setAlbumData((prev) =>
//           prev.filter((item) => !selectedImages.includes(item.myalbumPk))
//         );
//         setSelectedImages([]);
//         setAlertMessage("삭제가 완료되었습니다!");
//         setShowAlert(true);
//       } catch (err) {
//         console.error("삭제 실패:", err);
//         setAlertMessage("삭제 중 오류가 발생했습니다.");
//         setShowAlert(true);
//       }
//     };

//     return (
//         <>
//           <BeeAnimation />
//           <FlowerAnimation />
//           <Header />
//           <div className="background-container relative flex flex-col items-center min-h-screen">

//             {/* 타이틀 이미지 */}
//             <img
//               src={MyAlbumBoard}
//               alt="MyAlbumBoard"
//               className="w-[22rem] mt-20 -translate-y-80 z-10"
//             />
//             {/* 선택 삭제 버튼 */}
//             <button
//               className="absolute top-[12rem] right-[22.5rem] bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg z-30 text-xl font-whitechalk shadow-md transition"
//               onClick={deleteSelectedImages}
//             >
//               선택 삭제
//             </button>
//             </div>

//             {/* 앨범 스크롤 컨테이너 */}
//             <div className="absolute bottom-[3.5rem] left-1/2 translate-x-[-52.5%] w-[43rem] h-[30rem] overflow-y-scroll z-10 custom-scrollbar">
//             <div className="grid grid-cols-4 gap-4 px-4 py-2">
//               {albumData.length === 0 ? (
//                 <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
//                   저장된 사진이 없습니다.
//                 </p>
//               ) : (
//                 albumData.map((item) => (
//                   <div
//                     key={item.myalbumPk}
//                     className="relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
//                   >
//                     <input
//                       type="checkbox"
//                       className="absolute top-1 right-1 w-4 h-4"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedImages((prev) => [...prev, item.myalbumPk]);
//                         } else {
//                           setSelectedImages((prev) =>
//                             prev.filter((id) => id !== item.myalbumPk)
//                           );
//                         }
//                       }}
//                     />
//                     <img
//                       src={item.myalbumImgUrl}
//                       alt="album"
//                       onClick={() => setPreviewImage(item.myalbumImgUrl)}
//                       className="w-full aspect-square object-cover rounded-md cursor-pointer"
//                     />
//                     <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
//                     <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
//                   </div>
//                 ))
//               )}
//             </div>

//             </div>


//             {previewImage && (
//               <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//                 <div className="bg-white p-4 rounded-lg shadow-lg">
//                   <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
//                   <button
//                     className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
//                     onClick={() => setPreviewImage(null)}
//                   >
//                     닫기
//                   </button>
//                 </div>
//               </div>
//             )}

//             {showAlert && (
//               <CustomAlert
//                 message={alertMessage}
//                 onClose={() => setShowAlert(false)}
//               />
//             )}
//             {/* 나무 앨범 보드 배경 */}
//             <img
//               src={AlbumBoard}
//               alt="albumBoard"
//               className="w-[57rem] max-w-none absolute bottom-[-7rem] left-1/2 translate-x-[-50%]"
//             />
//         </>
        
//       );
      
//     };
    
//     export default MyAlbumPage;



// import React, { useEffect, useState } from "react";
// import BeeAnimation from "../../components/animations/BeeAnimation";
// import FlowerAnimation from "../../components/animations/FlowerAnimation";
// import Header from "../../components/Header";
// import MyAlbumBoard from "../../assets/images/mybookpicture.png";
// import AlbumBoard from "../../assets/images/board_album.png";
// import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
// import "./MyAlbumPage.css";
// import CustomAlert from "../../components/CustomAlert";
// import CustomConfirm from "../../components/CustomConfirm";

// const MyAlbumPage = () => {
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [albumData, setAlbumData] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     getAlbumApi()
//       .then((res) => {
//         console.log(res.data.data);
//         setAlbumData(res.data.data);
//       });
//   }, []);

//   const deleteSelectedImages = async () => {
//     if (selectedImages.length === 0) {
//       setAlertMessage("삭제할 사진을 선택해주세요!");
//       setShowAlert(true);
//       return;
//     }
//     try {
//       await deleteAlbumApi({ myalbumPks: selectedImages });
//       setAlbumData((prev) =>
//         prev.filter((item) => !selectedImages.includes(item.myalbumPk))
//       );
//       setSelectedImages([]);
//       setAlertMessage("삭제가 완료되었습니다!");
//       setShowAlert(true);
//     } catch (err) {
//       console.error("삭제 실패:", err);
//       setAlertMessage("삭제 중 오류가 발생했습니다.");
//       setShowAlert(true);
//     }
//   };

//   return (
//     <>
//       <BeeAnimation />
//       <FlowerAnimation />
//       <Header />

//       {/* 전체 배경 컨테이너 */}
//       <div className="background-container relative flex flex-col items-center min-h-screen w-full">

//         {/* 타이틀 이미지 */}
//         <img
//           src={MyAlbumBoard}
//           alt="MyAlbumBoard"
//           className="w-[28vw] min-w-[250px] mt-28 z-10"
//         />

//         {/* 선택 삭제 버튼 */}
//         <button
//           className="absolute top-[12vh] right-[5vw] bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg z-30 text-xl font-whitechalk shadow-md transition"
//           onClick={deleteSelectedImages}
//         >
//           선택 삭제
//         </button>

//         {/* 앨범 영역 (보드 + 사진) */}
//         <div className="relative w-[90vw] max-w-[1100px] ">
//           {/* 나무 앨범 보드 이미지 */}
//           <img
//               src={AlbumBoard}
//               alt="albumBoard"
//               className="w-[1100px] h-[800px] mb-28"
//             />

//           {/* 사진 그리드 스크롤 영역 */}
//           {/* <div className="absolute top-[9%] left-[11%] w-[78%] h-[68%] overflow-y-scroll custom-scrollbar">
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2 py-2">
//               {albumData.length === 0 ? (
//                 <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
//                   저장된 사진이 없습니다.
//                 </p>
//               ) : (
//                 albumData.map((item) => (
//                   <div
//                     key={item.myalbumPk}
//                     className="relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
//                   >
//                     <input
//                       type="checkbox"
//                       className="absolute top-1 right-1 w-4 h-4"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedImages((prev) => [...prev, item.myalbumPk]);
//                         } else {
//                           setSelectedImages((prev) =>
//                             prev.filter((id) => id !== item.myalbumPk)
//                           );
//                         }
//                       }}
//                     />
//                     <img
//                       src={item.myalbumImgUrl}
//                       alt="album"
//                       onClick={() => setPreviewImage(item.myalbumImgUrl)}
//                       className="w-full aspect-square object-cover rounded-md cursor-pointer"
//                     />
//                     <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
//                     <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
//                   </div>
//                 ))
//               )} */}
//             {/* </div> */}
//           {/* </div> */}
//         </div>
//       </div>

//       {/* 이미지 미리보기 모달 */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
//               onClick={() => setPreviewImage(null)}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 알림 */}
//       {showAlert && (
//         <CustomAlert
//           message={alertMessage}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//     </>
//   );
// };

// export default MyAlbumPage;

// import React, { useEffect, useState } from "react";
// import BeeAnimation from "../../components/animations/BeeAnimation";
// import FlowerAnimation from "../../components/animations/FlowerAnimation";
// import Header from "../../components/Header";
// import MyAlbumBoard from "../../assets/images/mybookpicture.png";
// import AlbumBoard from "../../assets/images/board_album.png";
// import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
// import "./MyAlbumPage.css";
// import CustomAlert from "../../components/CustomAlert";

// const MyAlbumPage = () => {
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [albumData, setAlbumData] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     getAlbumApi()
//       .then((res) => {
//         console.log(res.data.data);
//         setAlbumData(res.data.data);
//       });
//   }, []);

//   const deleteSelectedImages = async () => {
//     if (selectedImages.length === 0) {
//       setAlertMessage("삭제할 사진을 선택해주세요!");
//       setShowAlert(true);
//       return;
//     }
//     try {
//       await deleteAlbumApi({ myalbumPks: selectedImages });
//       setAlbumData((prev) =>
//         prev.filter((item) => !selectedImages.includes(item.myalbumPk))
//       );
//       setSelectedImages([]);
//       setAlertMessage("삭제가 완료되었습니다!");
//       setShowAlert(true);
//     } catch (err) {
//       console.error("삭제 실패:", err);
//       setAlertMessage("삭제 중 오류가 발생했습니다.");
//       setShowAlert(true);
//     }
//   };

//   return (
//     <>
//       <BeeAnimation />
//       <FlowerAnimation />
//       <Header />

//       {/* 전체 배경 컨테이너 */}
//       <div className="background-container relative flex flex-col items-center min-h-screen w-full">

//         {/* 선택 삭제 버튼 */}
//         <button
//           className="absolute top-[8vh] right-[5vw] bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg z-30 text-xl font-whitechalk shadow-md transition"
//           onClick={deleteSelectedImages}
//         >
//           선택 삭제
//         </button>

//         {/* 앨범 보드 영역 */}
//         <div className="relative w-[1700px] h-[1000px] mt-40 mb-20">

//           {/* 타이틀 이미지 - 줄에 걸리게 위치 */}
//           <img
//             src={MyAlbumBoard}
//             alt="MyAlbumBoard"
//             className="absolute top-[52px] left-1/2 transform -translate-x-1/2 w-[380px] z-20"
//           />

//           {/* 나무판자 보드 이미지 */}
//           <img
//             src={AlbumBoard}
//             alt="albumBoard"
//             className="w-full h-full object-contain"
//           />

//           {/* 사진 그리드 */}
//           <div className="absolute top-[258px] left-[471px] w-[760px] h-[580px] overflow-y-scroll custom-scrollbar">
//             <div className="grid grid-cols-4 gap-4">
//               {albumData.length === 0 ? (
//                 <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
//                   저장된 사진이 없습니다.
//                 </p>
//               ) : (
//                 albumData.map((item) => (
//                   <div
//                     key={item.myalbumPk}
//                     className="relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
//                   >
//                     <input
//                       type="checkbox"
//                       className="absolute top-1 right-1 w-4 h-4"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedImages((prev) => [...prev, item.myalbumPk]);
//                         } else {
//                           setSelectedImages((prev) =>
//                             prev.filter((id) => id !== item.myalbumPk)
//                           );
//                         }
//                       }}
//                     />
//                     <img
//                       src={item.myalbumImgUrl}
//                       alt="album"
//                       onClick={() => setPreviewImage(item.myalbumImgUrl)}
//                       className="w-full aspect-square object-cover rounded-md cursor-pointer"
//                     />
//                     <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
//                     <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 이미지 미리보기 모달 */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
//               onClick={() => setPreviewImage(null)}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 알림 */}
//       {showAlert && (
//         <CustomAlert
//           message={alertMessage}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//     </>
//   );
// };

// export default MyAlbumPage;


// import React, { useEffect, useState } from "react";
// import BeeAnimation from "../../components/animations/BeeAnimation";
// import FlowerAnimation from "../../components/animations/FlowerAnimation";
// import Header from "../../components/Header";
// import MyAlbumBoard from "../../assets/images/mybookpicture.png";
// import AlbumBoard from "../../assets/images/board_album.png";
// import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
// import "./MyAlbumPage.css";
// import CustomAlert from "../../components/CustomAlert";

// const MyAlbumPage = () => {
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [albumData, setAlbumData] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     getAlbumApi()
//       .then((res) => {
//         console.log(res.data.data);
//         setAlbumData(res.data.data);
//       });
//   }, []);

//   const deleteSelectedImages = async () => {
//     if (selectedImages.length === 0) {
//       setAlertMessage("삭제할 사진을 선택해주세요!");
//       setShowAlert(true);
//       return;
//     }
//     try {
//       await deleteAlbumApi({ myalbumPks: selectedImages });
//       setAlbumData((prev) =>
//         prev.filter((item) => !selectedImages.includes(item.myalbumPk))
//       );
//       setSelectedImages([]);
//       setAlertMessage("삭제가 완료되었습니다!");
//       setShowAlert(true);
//     } catch (err) {
//       console.error("삭제 실패:", err);
//       setAlertMessage("삭제 중 오류가 발생했습니다.");
//       setShowAlert(true);
//     }
//   };

//   return (
//     <>
//       <BeeAnimation />
//       <FlowerAnimation />
//       <Header />

//          {/* 선택 삭제 버튼 - 항상 오른쪽 하단 고정 */}
//          {/* <button
//         className="fixed bottom-[09vh] right-[23.5vw] bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg z-50 font-whitechalk shadow-lg transition"
//         onClick={deleteSelectedImages}
//       >
//         선택 삭제
//       </button> */}

//       {/* 전체 배경 컨테이너 */}
//       <div className="background-container relative flex flex-col items-center min-h-screen w-full">


//         {/* 선택 삭제 버튼 - 보드 우측 하단 아래 위치 */}
//         {/* <button
//   className="absolute top-[87%] right-[23.25%] z-30 bg-red-500 hover:bg-red-600 text-white font-whitechalk text-lg px-4 py-2 rounded-xl shadow-xl border-2 border-white"
//   onClick={deleteSelectedImages}
// >
//   선택 삭제
// </button> */}

//         {/* 앨범 보드 영역 */}
//         <div className="relative w-[88vw] max-w-[1200px] aspect-[13/10] mt-[7vh]">

//           {/* 타이틀 이미지 - 줄에 걸리게 */}
//           <img
//             src={MyAlbumBoard}
//             alt="MyAlbumBoard"
//             className="absolute top-[48px] left-1/2 transform -translate-x-1/2 w-[360px] z-20"
//           />

//            {/* 선택 삭제 버튼 - 보드 오른쪽 하단에 절대 위치 */}
//           <button
//             className="absolute top-44 right-72 bg-red-500 hover:bg-red-600 text-white py-3 px-5 rounded-lg z-30 font-whitechalk shadow-md"
//             onClick={deleteSelectedImages}
//           >
//             삭제🗑️
//           </button>
        

//           {/* 나무판자 보드 이미지 */}
//           <img
//             src={AlbumBoard}
//             alt="albumBoard"
//             className="w-full h-full"
//           />

//           {/* 사진 그리드 영역 */}
//           <div className="absolute top-[25.5%] left-[13%] w-[72%] h-[58%] overflow-y-scroll custom-scrollbar">
//             <div className="grid grid-cols-4 gap-4">
//               {albumData.length === 0 ? (
//                 <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
//                   저장된 사진이 없습니다.
//                 </p>
//               ) : (
//                 albumData.map((item) => (
//                   <div
//                     key={item.myalbumPk}
//                     className="relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
//                   >
//                     <input
//                       type="checkbox"
//                       className="absolute top-1 right-1 w-4 h-4"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedImages((prev) => [...prev, item.myalbumPk]);
//                         } else {
//                           setSelectedImages((prev) =>
//                             prev.filter((id) => id !== item.myalbumPk)
//                           );
//                         }
//                       }}
//                     />
//                     <img
//                       src={item.myalbumImgUrl}
//                       alt="album"
//                       onClick={() => setPreviewImage(item.myalbumImgUrl)}
//                       className="w-full aspect-square object-cover rounded-md cursor-pointer"
//                     />
//                     <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
//                     <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 이미지 미리보기 모달 */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
//               onClick={() => setPreviewImage(null)}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 알림 */}
//       {showAlert && (
//         <CustomAlert
//           message={alertMessage}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//     </>
//   );
// };

// export default MyAlbumPage;


// import React, { useEffect, useState } from "react";
// import BeeAnimation from "../../components/animations/BeeAnimation";
// import FlowerAnimation from "../../components/animations/FlowerAnimation";
// import Header from "../../components/Header";
// import MyAlbumBoard from "../../assets/images/mybookpicture.png";
// import AlbumBoard from "../../assets/images/board_album.png";
// import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
// import "./MyAlbumPage.css";
// import CustomAlert from "../../components/CustomAlert";

// const MyAlbumPage = () => {
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [albumData, setAlbumData] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [deleteMode, setDeleteMode] = useState(false); // ✅ 삭제 모드 여부

//   useEffect(() => {
//     getAlbumApi().then((res) => {
//       setAlbumData(res.data.data);
//     });
//   }, []);

//   const toggleSelectImage = (id) => {
//     setSelectedImages((prev) =>
//       prev.includes(id) ? prev.filter((pk) => pk !== id) : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     setSelectedImages(albumData.map((item) => item.myalbumPk));
//   };

//   const deselectAll = () => {
//     setSelectedImages([]);
//   };

//   const deleteSelectedImages = async () => {
//     if (selectedImages.length === 0) {
//       setAlertMessage("삭제할 사진을 선택해주세요!");
//       setShowAlert(true);
//       return;
//     }
//     try {
//       await deleteAlbumApi({ myalbumPks: selectedImages });
//       setAlbumData((prev) =>
//         prev.filter((item) => !selectedImages.includes(item.myalbumPk))
//       );
//       setSelectedImages([]);
//       setDeleteMode(false);
//       setAlertMessage("삭제가 완료되었습니다!");
//       setShowAlert(true);
//     } catch (err) {
//       console.error("삭제 실패:", err);
//       setAlertMessage("삭제 중 오류가 발생했습니다.");
//       setShowAlert(true);
//     }
//   };

//   return (
//     <>
//       <BeeAnimation />
//       <FlowerAnimation />
//       <Header />

//       {/* 배경 전체 컨테이너 */}
//       <div className="background-container relative flex flex-col items-center min-h-screen w-full">
//         {/* 선택 삭제 모드 진입 버튼 */}
//         {!deleteMode && (
//           <button
//             className="absolute top-[15vh] right-[35vw] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-30 font-whitechalk"
//             onClick={() => {
//               setDeleteMode(true);
//               setSelectedImages([]);
//             }}
//           >
//             🗑️삭제
//           </button>
//         )}

//         {/* 앨범 보드 */}
//         <div className="relative w-[88vw] max-w-[1200px] aspect-[13/10] mt-[7vh]">
//           {/* 타이틀 */}
//           <img
//             src={MyAlbumBoard}
//             alt="MyAlbumBoard"
//             className="absolute top-[48px] left-1/2 transform -translate-x-1/2 w-[360px] z-20"
//           />
//           <img src={AlbumBoard} alt="albumBoard" className="w-full h-full" />

//           {/* 이미지 그리드 */}
//           <div className="absolute top-[25.5%] left-[13%] w-[72%] h-[58%] overflow-y-scroll custom-scrollbar">
//             <div className="grid grid-cols-4 gap-4">
//               {albumData.length === 0 ? (
//                 <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
//                   저장된 사진이 없습니다.
//                 </p>
//               ) : (
//                 albumData.map((item) => (
//                   <div
//                     key={item.myalbumPk}
//                     className={`relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md ${
//                       deleteMode ? "border-2 border-yellow-200" : ""
//                     }`}
//                   >
//                     {/* ✅ 체크박스는 삭제 모드에서만 노출 */}
//                     {deleteMode && (
//                       <input
//                       type="checkbox"
//                       checked={selectedImages.includes(item.myalbumPk)}
//                       onChange={() => toggleSelectImage(item.myalbumPk)}
//                       className="absolute top-1 right-1 w-6 h-6 accent-yellow-400 border-2 border-white rounded-sm shadow-md z-30"
//                     />
                    
//                     )}
//                     <img
//                       src={item.myalbumImgUrl}
//                       alt="album"
//                       onClick={() => !deleteMode && setPreviewImage(item.myalbumImgUrl)}
//                       className={`w-full aspect-square object-cover rounded-md cursor-pointer ${
//                         deleteMode ? "opacity-80" : ""
//                       }`}
//                     />
//                     <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
//                     <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ 삭제 모드 툴바 */}
//       {deleteMode && (
//         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-xl border border-gray-300">
//           <span className="font-whitechalk text-m">{selectedImages.length}개 선택됨</span>
//           <button
//             onClick={selectAll}
//             className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md font-whitechalk"
//           >
//             전체 선택
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md font-whitechalk"
//           >
//             선택 해제
//           </button>
//           <button
//             onClick={deleteSelectedImages}
//             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-whitechalk"
//           >
//             삭제
//           </button>
//           <button
//             onClick={() => {
//               setDeleteMode(false);
//               setSelectedImages([]);
//             }}
//             className="text-gray-500 hover:text-black font-whitechalk"
//           >
//             취소
//           </button>
//         </div>
//       )}

//       {/* 미리보기 모달 */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
//               onClick={() => setPreviewImage(null)}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 알림 */}
//       {showAlert && (
//         <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />
//       )}
//     </>
//   );
// };

// export default MyAlbumPage;


import React, { useEffect, useState } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import MyAlbumBoard from "../../assets/images/mybookpicture.png";
import AlbumBoard from "../../assets/images/board_album.png";
import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
import "./MyAlbumPage.css";
import CustomAlert from "../../components/CustomAlert";

const MyAlbumPage = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    getAlbumApi().then((res) => {
      setAlbumData(res.data.data);
    });
  }, []);

  const toggleSelectImage = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((pk) => pk !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedImages(albumData.map((item) => item.myalbumPk));
  };

  const deselectAll = () => {
    setSelectedImages([]);
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) {
      setAlertMessage("삭제할 사진을 선택해주세요!");
      setShowAlert(true);
      return;
    }
    try {
      await deleteAlbumApi({ myalbumPks: selectedImages });
      setAlbumData((prev) =>
        prev.filter((item) => !selectedImages.includes(item.myalbumPk))
      );
      setSelectedImages([]);
      setDeleteMode(false);
      setAlertMessage("삭제가 완료되었습니다!");
      setShowAlert(true);
    } catch (err) {
      console.error("삭제 실패:", err);
      setAlertMessage("삭제 중 오류가 발생했습니다.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <BeeAnimation />
      <FlowerAnimation />
      <Header />

      <div className="background-container relative flex flex-col items-center min-h-screen w-full">
        <div className="relative w-[88vw] max-w-[1200px] aspect-[13/10] mt-[7vh]">

          {/* ✅ 삭제 버튼 - 보드 내부 기준으로 위치 고정 */}
          {!deleteMode && (
            <button
              className="absolute bottom-[110px] right-[200px] bg-white hover:bg-red-600  px-4 py-2 rounded-lg shadow-lg z-30 font-whitechalk text-2xl"
              onClick={() => {
                setDeleteMode(true);
                setSelectedImages([]);
              }}
            >
              🗑️
            </button>
          )}

          {/* 타이틀 */}
          <img
            src={MyAlbumBoard}
            alt="MyAlbumBoard"
            className="absolute top-[48px] left-1/2 transform -translate-x-1/2 w-[360px] z-20"
          />
          <img src={AlbumBoard} alt="albumBoard" className="w-full h-full" />

          {/* 이미지 그리드 */}
          <div className="absolute top-[25.5%] left-[14%] w-[72%] h-[58%] overflow-y-scroll custom-scrollbar">
            <div className="grid grid-cols-4 gap-4">
              {albumData.length === 0 ? (
                <p className="text-gray-500 text-xl col-span-4 text-center font-whitechalk">
                  저장된 사진이 없습니다.
                </p>
              ) : (
                albumData.map((item) => (
                  <div
                    key={item.myalbumPk}
                    className={`relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md ${
                      deleteMode ? "border-2 border-yellow-200" : ""
                    }`}
                  >
                    {deleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(item.myalbumPk)}
                        onChange={() => toggleSelectImage(item.myalbumPk)}
                        className="absolute top-1 right-1 w-6 h-6 accent-yellow-400 border-2 border-white rounded-sm shadow-md z-30"
                      />
                    )}
                    <img
                      src={item.myalbumImgUrl}
                      alt="album"
                      onClick={() => !deleteMode && setPreviewImage(item.myalbumImgUrl)}
                      className={`w-full aspect-square object-cover rounded-md cursor-pointer ${
                        deleteMode ? "opacity-80" : ""
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
                    <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 삭제 모드 툴바 */}
      {deleteMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-xl border border-gray-300">
          <span className="font-whitechalk text-m">{selectedImages.length}개 선택됨</span>
          <button
            onClick={selectAll}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            전체 선택
          </button>
          <button
            onClick={deselectAll}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            선택 해제
          </button>
          <button
            onClick={deleteSelectedImages}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            삭제
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setSelectedImages([]);
            }}
            className="text-gray-500 hover:text-black font-whitechalk"
          >
            취소
          </button>
        </div>
      )}

      {/* 이미지 미리보기 */}
      {previewImage && (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-[#deb887] border-4 border-[#a47148] rounded-2xl shadow-2xl p-6 flex flex-col items-center w-[85vw] max-w-[800px] min-h-[500px]">
        
        {/* 닫기 버튼 (우측 상단 못 모양 느낌) */}
        <button
          onClick={() => setPreviewImage(null)}
          className="absolute top-3 right-4 text-white bg-[#8b5e3c] hover:bg-[#a9714d] px-3 py-1 rounded-full shadow-md font-bold"
        >
          ✕
        </button>

      {/* 이미지 프리뷰 */}
      <img
        src={previewImage}
        alt="preview"
        className="rounded-lg max-h-[60vh] object-contain mt-8 shadow-md border-4 border-white"
      />

        </div>
      </div>
    )}


      {/* 알림 */}
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </>
  );
};

export default MyAlbumPage;
