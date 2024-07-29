import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../redux/store/store";
import { useRef } from "react";

function VideoRoom(){
    const { roomId } = useParams<{roomId: string}>();
    const name = useSelector((store:RootState)=>store.UserAuth.userData?.name);
    const  meetingContainerRef = useRef<HTMLDivElement>(null);
}