import React, {useEffect, useState} from 'react';
import {authProvider} from "../authProvider";
import {AuthenticationState, AzureAD} from "react-aad-msal";
import {Navigate} from "react-router-dom";
import {db} from "../firebase-config";
import {collection, getDocs, addDoc, doc, updateDoc} from "firebase/firestore"
import moment from "moment";
import Swal from 'sweetalert2'
import loader from "../assets/images/Dancing_kitty.gif"

const Profile = () => {
  const [std, setStd] = useState(null)
  const [quizs, setQuizs] = useState(null)
  const [user, setUser] = useState(null)
  const studentCollectionRef = collection(db, "students")
  const quizCollectionRef = collection(db, "quizs")
  const [isLoad, setIsLoad] = useState(true)
  const [isRefec, setIsRefec] = useState(true)

  useEffect(() => {
    if (std !== null) {
      // console.log(std)
      checkStudent();
    }
  }, [std])

  useEffect(() => {
    getQuizs()
  }, [])

  const checkStudent = async () => {
    const data = await getDocs(studentCollectionRef)
    let allStudent = data.docs.map(item => ({...item.data(), id: item.id}))
    if (allStudent.filter(item => item.email === std.email).length === 0) {
      createData()
    }else{
      setUser(allStudent.filter(item => item.email === std.email)[0])
      setIsLoad(false)
    }
  }

  const getQuizs = async () => {
    const data = await getDocs(quizCollectionRef)
    let allQuizs = data.docs.map(item => ({...item.data()})).reverse()
    setQuizs(allQuizs)
    setIsLoad(false)
  }

  const createData = async () => {
    await addDoc(studentCollectionRef, {...std, checkin: null, checkout: null, checkList: [false, false]})
    await checkStudent()
  }

  const setStudentData = async (item) => {
    if (std === null) {
      await setStd({name: item?.account.name, email: item?.account.userName})
    }
  }

  const checkSameDat = (dayOne, dayTwo) =>{
    return moment(moment.unix(dayOne).format('yyyy-MM-DD')).isSame(moment.unix(dayTwo).format('yyyy-MM-DD'), 'day')
  }

  const isCheckIn = (eventDate) =>{
    return ((moment().unix() >= moment.unix(eventDate).add(-15,'minutes').unix()) && (moment().unix() <= moment.unix(eventDate).add(15, 'minutes').unix()))
  }

  const isCheckTime = (eventDate) =>{
    return ((moment().unix() < moment.unix(eventDate).add(-15,'minutes').unix()))
  }

  const onCheckIn = async () =>{
    await Swal.fire({
      icon: 'success',
      title: 'เช็คอินสำเร็จ',
      showConfirmButton: false,
      timer: 1000
    })
    await setIsLoad(true)
    const userDoc = doc(db,"students", user.id)
    const newUser = {...user, checkin: new Date()}
    await updateDoc(userDoc, newUser)
    await checkStudent()
  }



  return (
    isLoad ?
      <div className={'flex w-screen h-screen bg-blue-50'}>
        <div className={'flex w-10/12 h-5/6 bg-white shadow-lg rounded-xl mx-auto my-auto'}>
          <div className={'flex flex-col justify-center items-center mx-auto'}>
            <img
              src={loader}
              className={'w-20 h-12'}
            />
            <p className={'mt-3 font-sukhumvit font-bold text-xl'}>กำลังโหลดข้อมูล</p>
          </div>
        </div>
      </div>
      :
    <div>
      <AzureAD provider={authProvider} accountInfoCallback={(data) => setStudentData(data)}>
        {
          ({logout, authenticationState, accountInfo}) => {
            switch (authenticationState) {
              case AuthenticationState.Authenticated:
                return (
                  <div className={'flex w-screen h-screen bg-blue-50'}>
                    <div className={'flex w-10/12 h-5/6 bg-white shadow-lg rounded-xl mx-auto my-auto'}>
                      <div className={'flex w-full flex-col p-5'}>
                        <span className={'flex w-full space-x-10 items-center'}>
                          <span className={'flex w-1/2'}>
                            <p
                              className={'font-sukhumvit font-bold text-3xl'}>{`สวัสดี ${accountInfo.account.name}`}</p>
                          </span>
                          <span className={'flex justify-end w-1/2'}>
                            <button className={'font-sukhumvit font-bold text-xl text-red-400'}
                                    onClick={logout}>ออกจากระบบ</button>
                          </span>
                        </span>
                        <span className={'mt-5'}>
                          <p className={'font-sukhumvit font-bold text-xl '}>รายการเช็คอินการติว</p>
                        </span>
                        <span className={'flex w-auto md:w-full mt-10 '}>
                          <table className="w-full text-sm text-left text-gray-500 ">
                            <thead className="w-auto font-sukhumvit font-bold text-lg text-gray-700 bg-blue-50">
                              <tr>
                                  <th scope="col" className="py-3 px-6">
                                      หัวข้อ
                                  </th>
                                  <th scope="col" className="py-3 px-6 hidden md:flex">
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                    สถานะ
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                      <span className="sr-only">Edit</span>
                                  </th>
                              </tr>
                            </thead>
                            <tbody>
                            {
                              (quizs && isRefec) && quizs.map((quiz,key) => {
                                return (
                                  <tr key={key}
                                    className="font-sukhumvit bg-white border-b hover:bg-gray-50">
                                    <th scope="row"
                                        className="py-4 px-6 text-xs md:text-base text-gray-900 whitespace-nowrap">
                                      {quiz?.title}
                                    </th>
                                    <td className="py-4 px-6 hidden md:flex">
                                    </td>
                                    <td className={"py-4 px-6 text-xs md:text-base font-bold" + (user?.checkList[key] ? " text-blue-400" : user?.checkList[key] === false ? " text-red-400" : " text-yellow-400")}>
                                      {
                                        user?.checkList[key] ? 'เช็คอินเรียบร้อยแล้ว' : user?.checkList[key] === false ? 'ไม่ได้เช็คอิน' : 'กำลังตรวจสอบ'
                                      }
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                      {/*{*/}
                                      {/*  console.log(quiz?.title, quiz?.date.seconds, moment.unix(quiz?.date.seconds).add(-15,'minutes').format("yyyy-MM-DD hh:mm"))*/}
                                      {/*}*/}
                                      {/*{*/}
                                      {/*  console.log((moment().unix() >= moment.unix(quiz?.date.seconds).add(-15,'minutes').unix()) && (moment().unix() <= moment.unix(quiz?.date.seconds).add(15, 'minutes').unix()))*/}
                                      {/*}*/}
                                      {/*{*/}
                                      {/*  console.log(checkSameDat(user?.checkin.seconds, quiz?.date.seconds))*/}
                                      {/*}*/}
                                      {/*<a className={"font-bold text-blue-500 hover:underline cursor-pointer"}>{isCheckIn(quiz?.date.seconds) ? (checkSameDat(user?.checkin.seconds, quiz?.date.seconds) ? 'เช็คเอาท์' : 'เช็คอิน') : 'หมดเวลา'}</a>*/}
                                      {
                                        (isCheckIn(quiz?.date?.seconds) ? (checkSameDat(user?.checkin?.seconds, quiz?.date.seconds) ? <a className={"font-bold text-xs md:text-base text-blue-500 hover:underline cursor-pointer"}>เช็คเอาท์</a> : <a onClick={()=> onCheckIn()} className={"font-bold text-xs md:text-base text-blue-500 hover:underline cursor-pointer"}>เช็คอิน</a>) : isCheckTime(quiz?.date.seconds) ? <p className={"font-bold text-xs md:text-base text-gray-500"}>ยังไม่เปิดเช็คอิน</p> : <p className={"font-bold text-xs md:text-base text-gray-500"}>หมดเวลา</p>)
                                      }
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                          </table>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              default:
                return <Navigate to={'/'}/>
            }
          }
        }
      </AzureAD>
    </div>
  );
};

export default Profile;