import logo from './assets/images/logo.png';
import './App.css';
import {authProvider} from "./authProvider";
import {AzureAD, AuthenticationState} from "react-aad-msal";
import {Navigate, Route, Routes} from "react-router-dom";
import Profile from "./screens/profile";
import moment from "moment";

function App() {
  const auth = () =>( <AzureAD provider={authProvider} forceLogin={false}>
    {
      ({login, logout, authenticationState, error, accountInfo}) => {
        switch (authenticationState) {
          case AuthenticationState.Authenticated:
            return <Navigate to={'/profile'} />;
          case AuthenticationState.Unauthenticated:
            return (
              <div className={'flex w-screen h-screen bg-blue-50 max-h-screen max-w-screen overflow-auto'}>
                <div className={'w-11/12 h-4/6 md:w-3/12 md:h-3/6 mx-auto my-auto min-h-test'}>
                  <div className={'w-full h-full bg-white rounded-xl shadow-md'}>
                    <div className={'flex flex-col p-5 justify-center text-center'}>
                        <span className={'mt-5'}>
                          <p className={'font-sukhumvit font-bold text-2xl text-gray-600'}>ระบบเช็คชื่อเข้าติววิชา JavaScript</p>
                        </span>
                      <span className={'mt-5 mx-auto'}>
                          <img src={logo} alt="KMUTT LOGO" width={200} height={200}/>
                        </span>
                      <span className={'mt-5'}>
                          <button onClick={login} className={'pl-3 pr-3 w-auto h-10 bg-blue-300 hover:bg-blue-400 font-sukhumvit font-bold text-base text-white shadow-sm rounded-full'}>เข้าสู่ระบบด้วย KMUTT ACCOUNT</button>
                        </span>
                      {
                        error &&  <span className={'mt-5'}>
                          <p className={'font-sukhumvit font-bold text-lg text-red-400'}>มีบางอย่างผิดพลาด โปรดลองใหม่อีกครั้ง</p>
                        </span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
        }
      }
    }
  </AzureAD>)
  return (
    <Routes>
      <Route path="/" element={auth()} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
  );
}

export default App;
