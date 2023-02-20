import App from "./App";
import { useState, useRef, useEffect } from "react";


export default function Intro(props) {

    const parent = useRef(null);
    const [anim,setAnim] = useState(true);
    const animatedComponent = [];
    for(let i = 0; i < 3; i++) {
      animatedComponent[i] = useRef(null);
    }

    useEffect(() => {
        if(anim)
            intro();
      }, [animatedComponent[0],animatedComponent[1],animatedComponent[2]]);

    const skip = (event) => {

        setAnim(false);
      }

      function intro() {
        
        if(hasNullValue(animatedComponent))
            return;

        function animate(index) {
            animatedComponent[2 - index].current.classList.add('intro-anim' + (3 -(index)));
            setTimeout(() => {
                if(animatedComponent[2 - index].current != null)
                animatedComponent[2 - index].current.remove();

                
                if(index < 2)
                animate(index + 1);
                else
                setAnim(false);
            
            },getAnimDuration(index));    
    

        }

        animate(0);
      }

      function getAnimDuration(index) {
        const dur = parseInt(getComputedStyle(animatedComponent[2-index].current).animationDuration.substring(0,1)) * 1000;

        return dur;
      }


    return (

        anim ? (
            <div id="parent" ref={parent}>
              <h1 className='intro' ref={animatedComponent[0]}>Let's start!</h1>
              <h1 className='intro' ref={animatedComponent[1]}>We will ask you your favorite movies to recommend you a movie to watch tonight!</h1>
              <h1 className='intro' ref={animatedComponent[2]}>Welcome to Movie Finder!</h1>
            <button className='skip' onClick={skip}>Skip</button>
            </div> ) : (<App/>)
    );
}




function hasNullValue(list) {

    let val = false;

    list.forEach((value) => {
        if(value.current == null || value.current == undefined)
            val = true;

    });
    return val;
}