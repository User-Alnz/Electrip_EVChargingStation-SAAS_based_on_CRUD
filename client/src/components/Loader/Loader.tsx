import "./loader.css"

type LoaderProps = {
    style?: React.CSSProperties; // style is optional
};

function Loader({style} : LoaderProps){

    return(
        <section className="loaderWrapper" style={style} >
            <div className="loader" ></div>
        </section>
    );
}

export default Loader; 