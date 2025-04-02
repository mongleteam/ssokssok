import React, { useState, useEffect } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import { findIdApi } from "../../apis/authApi";

const FindIdPage = () => {

    const [formData, setFormData] = useState({
        email: ""
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
      }

    const [identification, setIdentification] = useState(null)
    const handleFindid = async () => {
        const res = await findIdApi(formData)

        if(res.message == false){
            alert("해당하는 아이디가 없습니다.");
            return
        }else{
            setIdentification(res.data.data.id)
            console.log(res.data.data.id)
        }
    }

    return (
        <>
        <BeeAnimation />
        <FlowerAnimation/>
            <div className="background-container relative flex flex-col items-center">
            <div className="input-wrapper">
                <label htmlFor="id">이메일 :</label>
                    <input id="email" name="email" type="text" placeholder="이메일을 입력하세요" className="custom-input" 
                    value={formData.email} onChange={handleChange}
                    />   

                <button className="confirm-button mt-7"   onClick={() => {
                        console.log("✅ ㅅㅂ")
                        handleFindid()
                }}>보내기</button>

            </div>
            {identification && (
    <div className="mt-5 text-lg font-bold text-blue-600">
      찾은 아이디: {identification}
    </div>
  )}

            </div>
        </>
    ) 
}

export default FindIdPage;