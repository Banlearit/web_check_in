import React, {useEffect, useState} from 'react';
import {authProvider} from "../authProvider";
import {AuthenticationState, AzureAD} from "react-aad-msal";
import {Navigate} from "react-router-dom";
import {db} from "../firebase-config";
import {collection, getDocs, addDoc} from "firebase/firestore"
import moment from "moment";

const Profile = () => {
  const [std, setStd] = useState(null)
  const [quizs, setQuizs] = useState(null)
  const [user, setUser] = useState(null)
  const studentCollectionRef = collection(db, "students")
  const quizCollectionRef = collection(db, "quizs")

  useEffect(() => {
    if (std !== null) {
      console.log(std)
      checkStudent();
    }
  }, [std])

  useEffect(() => {
    getQuizs()
  }, [])

  const checkStudent = async () => {
    const data = await getDocs(studentCollectionRef)
    let allStudent = data.docs.map(item => ({...item.data()}))
    if (allStudent.filter(item => item.email === std.email).length === 0) {
      createData()
    }else{
      setUser(allStudent.filter(item => item.email === std.email)[0])
    }
  }

  const getQuizs = async () => {
    const data = await getDocs(quizCollectionRef)
    let allQuizs = data.docs.map(item => ({...item.data()})).reverse()
    setQuizs(allQuizs)
  }

  const createData = async () => {
    await addDoc(studentCollectionRef, {...std, checkin: null, checkout: null})
  }

  const setStudentData = async (item) => {
    if (std === null) {
      await setStd({name: item?.account.name, email: item?.account.userName})
    }
  }

  return (
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
                        <span className={'flex w-full mt-10 '}>
                          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="font-sukhumvit font-bold text-lg text-gray-700 bg-blue-50">
                              <tr>
                                  <th scope="col" className="py-3 px-6">
                                      หัวข้อ
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                  </th>
                                  <th scope="col" className="py-3 px-6">
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
                              quizs && quizs.map((quiz,key) => {
                                return (
                                  <tr key={key}
                                    className="font-sukhumvit bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {quiz?.title}
                                    </th>
                                    <td className="py-4 px-6">
                                    </td>
                                    <td className="py-4 px-6">
                                    </td>
                                    <td className={"py-4 px-6" + (user?.checkList[key] ? " text-blue-400" : user?.checkList[key] === false ? " text-red-400" : " text-yellow-400")}>
                                      {
                                        user?.checkList[key] ? 'เช็คอินเรียบร้อยแล้ว' : user?.checkList[key] === false ? 'ไม่ได้เช็คอิน' : 'กำลังตรวจสอบ'
                                      }
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                      {
                                        console.log(quiz?.title, quiz?.date.seconds)
                                      }
                                      {
                                        console.log("now: " + moment().unix(), "event: " + moment.unix(quiz?.date.seconds).add(10,"minute").unix())
                                      }
                                      <a className="font-bold text-blue-500 hover:underline">เช็คอิน</a>
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