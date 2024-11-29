const images_id = document.getElementById("carousel-img");
const img = document.querySelectorAll("#carousel-img img");

let count = 0;
const imgWidth = 1900;

function carousel() {
    count++;
    if (count >= img.length) {
        count = 0;
    }
    images_id.style.transform = `translateX(${-count * imgWidth}px)`;
}
setInterval(carousel, 4000);
