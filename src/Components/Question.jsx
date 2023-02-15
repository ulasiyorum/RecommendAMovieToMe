import './Question.css';

function QuestionCard(props) {

    return (
    <div className='questionCard'>
        <img src={props.src}/>
        <h1>{props.title}</h1>
        <div className='qc-stars'>
            <h5>Rating: </h5>
            <h5>{props.stars}</h5>
        </div>
    </div>
    
    );


}

export default function Question(props) {

    return (

        <div className='question'>
            <h1>Pick Your Favorite!</h1>
            <div>
                <QuestionCard src="https://cdn.akakce.com/z/-/garfield-ile-arkadaslari-6-garfield-anne-jim-davis.jpg" 
                title="Garfield" 
                stars="3.5"/>
                <QuestionCard 
                src="https://4.bp.blogspot.com/-iWQcXv1aQtg/VuBMclOorTI/AAAAAAAACWs/J_G7At1btxg/s1600/12829538_984188611662570_1510427957506789901_o.jpg" 
                title="Bravo" 
                stars="4.1"/>
                <QuestionCard 
                src="https://cdn.evrimagaci.org/kFhCLkXq79Gb_9-3Dg9SL5760xA=/evrimagaci.org%2Fpublic%2Fmi_media%2F81b2df18d4bec0d7649d969a6f116544.png"
                title="Gumball" 
                stars="5"/>
            </div>
        </div>


    );
}