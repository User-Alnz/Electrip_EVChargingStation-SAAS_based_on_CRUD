const   handleClick = document.getElementById("button");
const   WebsiteTitle = document.getElementById("title")
let     index = 0;

handleClick.addEventListener("click", () => {
    
    const colorDictionary = [ "#cf0606", "#9c27b0", "#ff9800", "#2a9df4" ];

    if(index < 4)
        index++;
    else
        index = 0;

    WebsiteTitle.style.color = colorDictionary[index];

});