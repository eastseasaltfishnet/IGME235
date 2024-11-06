
// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

}
function dataLoad(){


}
for (let i = 0; i < result.length; i++) {

    let result = results[i];

    let samllURL = result.images.fixed_width_small.url;
    if (!samllURL) samllURL = "images/no-image-found.png";

    let url = result.url;
    let rating = reuslt.reating.toUpperCase();

    let line = '<div class='result'><img src='${samllURL}' titles'${result.title}'/>';
    line +='<span><a target='_blank' href='${url}'>${result.title}</a></span>'
}

