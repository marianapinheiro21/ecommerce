//const images_id = document.getElementById("carousel-img");
//const img = document.querySelectorAll("#carousel-img img");
const addCarrinho = document.querySelectorAll('.add-to-cart');
const contadorCarrinho = document.querySelector('#cart-count');
let carrinhoItens = {};

//let count = 0;
//const imgWidth = 1900;

//function carousel() {
//    count++;
//    if (count >= img.length) {
//        count = 0;
 //   }
 //   images_id.style.transform = `translateX(${-count * imgWidth}px)`;
//}
//setInterval(carousel, 4000); 

addCarrinho.forEach(button=> {
    button.addEventListener('click', function(){
        const nomeProduto = button.dataset.nomeProduto;
        const idProduto = button.dataset.idProduto;

        if (carrinhoItens[idProduto]) {
            carrinhoItens[idProduto].quantity++
        } else {
            carrinhoItens[idProduto] = {name: nomeProduto, quantity: 1};
        }

        
        contadorCarrinho.textContent= Object.values(carrinhoItens).reduce((total, item)=> total + item.quantity, 0);
    });
});

const checkoutButton = document.querySelector('#cart-icon');

checkoutButton.addEventListener('click', function(){ 
   const carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || {};

   localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));

   

   fetch('/carrinho/', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify({ carrinhoItens: carrinhoItens }),
   })
   .then (Response => {
    if(Response.ok) {
        window.location.href = '/carrinho/';
    }else {
        console.error('Falha ao enviar os dados para o servidor')
    }
   })
    .catch(error => {
        console.error('Erro na requisição:', error)
    });
});