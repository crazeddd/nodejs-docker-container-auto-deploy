const toastContainer = document.querySelector("toasts");

//Sleep function
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var interval = 1000;

function displayToast(toast) {
    setTimeout(async function () {
      //Add element
      const newToast = document.createElement("toast");
      newToast.classList.add(toast.type);
      newToast.innerHTML = `<p>${toast.title}</p><small>${toast.body}</small>`;
      toastContainer.prepend(newToast);

      //Add animation
      var activeToast = document.querySelector("toast");
      activeToast.style.animation = "pop-up 6s ease-in-out forwards";

      //Remove toast
      await sleep(6000);
      newToast.remove();
    }, i * interval);
};

export function createToast(res) {
  var toast = {
    title: res,
    //body: ,
    //type: 
  };
  displayToast(toast);
  toastContainer.style.background = "black";
};