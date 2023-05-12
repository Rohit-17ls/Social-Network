import React, { useEffect, useRef, useState } from "react";
import user from '../../public/user.png';
import SmartText from "./SmartText";
import { useLocation, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import NotFound from "../routes/NotFound";
import EditIcon from "../icons/EditIcon";
import NotificationIcon from "../icons/NotificationIcon";
import Notifications from "./Notifications";
import UserPosts from "./UserPosts";
import Connections from "./Connections";
import SaveIcon from "../icons/SaveIcon";
import SmallSpinner from "./SmallSpinner";
import axios from "axios";

// import dp from '/src/profile_dp.jpg'



export default function Dashboard() {

    const {username} = useParams();
    const [is404, setIs404] = useState(0);
    const [isFetching, setIsFetching] = useState(1);
    const [refetch, setRefetch] = useState(1);
    const [ordering, setOrdering] = useState('Recent');
    const [showConnections, setShowConnections] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(0);
    const cloudName = 'duoljv54r';
    
    const [userData, setUserData] = useState({});
    
    const notificationsRef = useRef();
    const showConnectionsRef = useRef();
    const imgUploadRef = useRef();
    const imgRef = useRef();
    const updateProfileRef = useRef();
    
    const location = useLocation();
    
    const updateFollow = async() => {
        const res = await fetch(`http://localhost:3000/api/followuser`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({targetUsername : username})
        });
        const data = await res.json();
        
        console.log(data);
        
        if(!data.isUpdatedFollowStatus) return;
        
        setRefetch(!refetch);
    }

    const updateDescription = async() => {
        console.log(description);
        if(description){
            setSaving(1);
            const res = await fetch('http://localhost:3000/api/userdescription', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({description})
                        });
            const data = await res.json();
            console.log(data);
            setSaving(0);
            updateProfileRef.current.close();
            
        }
        setRefetch(!refetch);
    }
    
    const updateProfileImage = async(e) => {
        console.log(imgUploadRef.current);
        imgRef.current.src = URL.createObjectURL(e.target.files[0]);
        setImage(1);
    }

    const saveProfile = async() => {
        if(image){
            try{
                setSaving(1);

                const file = imgUploadRef.current.files[0];
                const formData = new FormData();
                formData.append('file', file)
                formData.append('upload_preset', 'cvz1jvwg');
            
                let res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, formData);
                
                if(res){
                    console.log(res.data.url.split('upload/'));
                    let imgData = res.data.url.split('upload/')[1].split('/');
                    console.log(imgData);
                    if(imgData){
                        res = await fetch('http://localhost:3000/api/userprofileimg', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({img_version: imgData[0],
                                img_folder_name: imgData[1],
                                img_public_id : imgData[2], })
                        });
                        const data = await res.json();
                        console.log(data);
                    }
                }

            }catch(err){
                console.log(err);
            }
            setSaving(0);
        }
        setRefetch(!refetch);
    }
    
    

    useEffect(() => {
       
        const retrieveUserData = async() => {
            const res = await fetch(`http://localhost:3000/api/user/${username}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();

            setIsFetching(false);
            console.log(data);

            if(!data.isRetrieved){
                setIs404(1);
                return;
            }

            if(data.data.imgPublicID !== null){
                data.data.imageURL = `https://res.cloudinary.com/duoljv54r/image/upload/${data.data.imgVersion}/${data.data.imgFolderName}/${data.data.imgPublicID}`;
            }
            setUserData(data.data);

        }

        

        retrieveUserData();

    

    }, [refetch, location.pathname]);


    if(is404) return (<NotFound/>);


    return (
        <>
            {isFetching ? <Spinner/> :
            <div className="w-2/3 w-min-[500px] max-w-[800px] h-full flex llg-max:w-[80%] m-auto xl-max:w-[600px]">
                <div className="w-full h-full bg-wcolor flex flex-col gap-4">
                    <div className="w-full w-min-[500px] flex items-center justify-start h-[30vh]">
                        <div className="w-1/3 rounded-[100vw] flex justify-center items-start min-w-[100px] min-h-[100px] max-w-[200px] max-h-[200px]" 
                             onClick={() => {
                                imgUploadRef.current.click();
                            }}>
                            <img src={userData.imageURL || user}
                                 ref={imgRef}
                                 alt="profile-img" 
                                 className="bg-[#fcf6f6a8] rounded-[100vh] w-[12em] h-[12em] border-4 border-solid border-themecolor"
                            />
                            <dialog>
                                <form onChange={updateProfileImage}>
                                    <input type="file" className="hidden " ref={imgUploadRef}/>
                                </form>
                            </dialog>
                        </div>
                        <div className="flex flex-col max-h-[35vh] min-h-fit items-start w-4/5 font-semibold sm:p-2 md:p-4 lg:p-6 xl:p-8 md-max:text-sm text-sm">
                            <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">{username}</div>
                            <div className="sm:text-xs md:text-sm lg:text-md xl:text-lg">{userData.email}</div>
                            <div className="flex flex-col items-start gap-2 text-xs md:text-sm lg:text-md xl:text-lg font-normal">
                                <div className="font-semibold">
                                    {userData.postsCount} Posts &emsp; 
                                    {userData.followers} <span onClick={() => {
                                                                    setShowConnections('Followers');
                                                                    showConnectionsRef.current.showModal();
                                                                }        
                                                        }>Followers</span> &emsp; 
                                    {userData.following} <span onClick={() => {
                                                                    setShowConnections('Following');
                                                                    showConnectionsRef.current.showModal();
                                                                }
                                                        }>Following</span>
                                </div>
                                
                                <div className="sm:text -xs xl:text-sm font-normal text-left">
                                    <SmartText text={userData.description || ''}/>
                                </div>
                                <div className="text-left my-0">
                                    <strong className="inline">Groups: </strong>
                                    {userData.groups.map((group, id) => <span className="mx-1 inline"><SmartText text={`&${group.groupname}`}/></span>)}
                                </div>

                                {!userData.isViewingSelf && <button type="button" onClick={updateFollow} className="p-0" style={{borderRadius: '100vw'}}>{userData.isFollowing ? 'Following' : 'Follow'}</button>}
                                {userData.isViewingSelf && 
                                    <div className="flex flex-row gap-5">
                                        <span title="Edit Profile" onClick={() => {updateProfileRef.current.showModal()}}><EditIcon/></span>
                                        <span title="View Notifications" onClick={() => {notificationsRef.current.showModal()}}><NotificationIcon/></span>
                                        <span title="Save Profile" onClick={() => saveProfile()}>{saving ? <SmallSpinner/> : <SaveIcon/>}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* <div>
                            <button className="w-32 border-2 border-gray-400">Messages</button>
                        </div> */}
                    </div>

                    <dialog ref={notificationsRef}>
                        <div className="w-fit p-2">
                            <Notifications/>
                            <button className="my-4 mx-auto" style={{background: 'grey'}} type="button" onClick={() => {notificationsRef.current.close()}}>Close</button>
                        </div>
                    </dialog>

                    
                        <dialog ref={showConnectionsRef}>
                            <div className="m-3 w-[300px] max-h-[45vh] min-h-[25vh] flex flex-col justify-evenly">
                                <strong className="block text-xl mx-auto my-2">{showConnections}</strong>
                                {showConnections && <Connections type={showConnections} username={username}/>}
                                <button className="m-4" style={{background: 'grey'}} type="button" onClick={() => {showConnectionsRef.current.close()}}>
                                    Close
                                </button>
                            </div>
                        </dialog>

                        <dialog ref={updateProfileRef}>
                            <div className="m-3 p-2 w-fit max-h-[45vh] min-w-[400px] flex flex-col gap-4">
                                <div>
                                    <strong className='block text-center text-2xl my-2'>Update Description</strong>
                                    <span className="text-xs text-grayedcolor">Max 480 characters</span>
                                </div>
                                <textarea placeholder="Description (max 480 characters)" className="bg-bglight p-3" onChange = {(e) => {setDescription(e.target.value)}}>
                                </textarea>
                                <div className="flex flex-row justify-evenly mt-2">
                                    <button type="button" onClick={updateDescription}>{saving ? <SmallSpinner/> :  'Save'}</button>
                                    <button type="button" onClick={() => {updateProfileRef.current.close()}} style={{background: 'gray'}}>Close</button>
                                </div>
                            </div>
                        </dialog>

                

                    <div className="w-full h-full border-t m-3 flex flex-col justify-start items-center">
                        <strong className="block text-xl mt-5 text-center">POSTS</strong>
                        <div className="w-full border-b-2 flex flex-row justify-center my-5 border-b-grayedcolor">
                            <span className={`w-1/2 text-center ${ordering !== 'Recent' && 'text-grayedcolor'}`} onClick={() => {setOrdering('Recent')}}>Recent</span>
                            <span className={`w-1/2 text-center ${ordering !== 'Popular' && 'text-grayedcolor'}`} onClick={() => {setOrdering('Popular')}}>Popular</span>
                        </div>
                        <UserPosts username={username} ordering={ordering}/>
                    </div>  
                </div>
            </div>
            }
        </>
    )
}