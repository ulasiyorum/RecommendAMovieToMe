import "../App.css";
import { useRef } from "react";


export default function intro(){
    let anims = document.querySelectorAll('.intro');
    if(anims.length == 0)
        return;


    
        
    let animations = [];
    anims.forEach((value,index) => {
        value.classList.add('intro-anim' + (index+1));
        animations.push(value);
        durs += getAnimationDuration();
        value.remove();
    });

    const parent = document.getElementById('parent');

    const getElement = () => {
        const removeElement = () => {
            item.remove();

            if(animations.length > 0)
                getElement();
        } 
        let item = animations.pop();
        parent.appendChild(item);
        const duration = getAnimationDuration();
        setTimeout(removeElement,duration);
    }

    getElement();
}


function getAllAnimationDuration(){

    let q = document.querySelectorAll('.intro');

    if(q.length == 0)
        return 0;


    let dur = 0;
    q.forEach((value) => {
       dur += parseInt(getComputedStyle(value).animationDuration.substring(0,1)) * 1000;
       console.log(dur);
    });

    return dur;

}

export let durs = 0;

function getAnimationDuration() {

    let q = document.querySelector('.intro');
    const dur = parseInt(getComputedStyle(q).animationDuration.substring(0,1)) * 1000;
    return dur;
}