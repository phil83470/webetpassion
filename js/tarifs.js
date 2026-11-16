const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

const modal = document.querySelector("#orderModal");
const closeButtons = document.querySelectorAll("[data-close-modal]");
const packButtons = document.querySelectorAll(".choose-pack");

const selectedPack = document.querySelector("#selectedPack");
const selectedPrice = document.querySelector("#selectedPrice");
const orderForm = document.querySelector("#orderForm");

function openModal(pack, price) {
  selectedPack.textContent = pack;
  selectedPrice.textContent = price;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modal.removeAttribute("inert");
  document.body.style.overflow = "hidden";

  document.querySelector("#name")?.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
  document.body.style.overflow = "";
}

packButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.pack, button.dataset.price);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  const pack = selectedPack.textContent;
  const price = selectedPrice.textContent;

  const subject = encodeURIComponent(`Demande de commande - ${pack}`);

  const body = encodeURIComponent(
    `Bonjour Philippe,

Je souhaite commander le ${pack} au tarif de ${price} €.

Nom / Prénom : ${name}
E-mail : ${email}
Téléphone : ${phone || "Non renseigné"}

Message :
${message || "Aucun message supplémentaire."}

Je souhaite poursuivre la commande et être informé de la procédure de paiement par virement bancaire.`,
  );

  window.location.href = `mailto:bonjour@webetpassion.fr?subject=${subject}&body=${body}`;
});
