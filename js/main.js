//! CONSTANTS =>>
const mainForm = document.getElementById("mainForm");
const bookmarkNameInput = document.getElementById("bookmarkNameInput");
const bookmarkUrlInput = document.getElementById("bookmarkUrlInput");
const bookMarkContainer = document.getElementById("bookMarkContainer");
let bookmarkList = JSON.parse(localStorage.getItem("bookmarkList")) || [];
const deleteModal = window.document.getElementById("deleteModal");
const confirmDeleteButton = window.document.getElementById("confirmDeleteButton");
const validInputsAlert = `
<div class="alert alert-success alert-dismissible">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <strong>Success!</strong> Bookmark Added Successfully!.
</div>
`;
const invalidInputsAlert = `
<div class="alert alert-danger alert-dismissible">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <strong>Invalid Inputs!</strong> fill both inputs or inter a vaild URL.
</div>
`;
window.addEventListener("DOMContentLoaded", renderBookmarks);
function renderBookmarks() {
    bookMarkContainer.innerHTML = '';
    bookmarkList.forEach((bookmark, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${bookmark.name}</td>
            <td>
                <a href="${bookmark.url}" target="_blank" class="btn btn-success btn-sm">
                    <i class="fas fa-eye me-1"></i>Visit
                </a>
            </td>
            <td>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i class="fas fa-trash me-1"></i>Delete
                </button>
            </td>
        `;
        bookMarkContainer.appendChild(row);
    });
};
function formatUrl(inputUrl) {
    if (inputUrl.startsWith('https://')) { return inputUrl; }
    else if (inputUrl.startsWith('http://')) { return 'https://' + inputUrl.slice(7); }
    else { return 'https://' + inputUrl; }
};
mainForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = bookmarkNameInput.value.trim();
    const linkRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    const url = bookmarkUrlInput.value.trim();
    if (name && linkRegex.test(url)) {
        const formattedUrl = formatUrl(url);
        const newBookmark = { name, url: formattedUrl };
        bookmarkList.push(newBookmark);
        localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
        renderBookmarks();
        mainForm.insertAdjacentHTML('afterbegin', validInputsAlert);
    } else {
        mainForm.insertAdjacentHTML("afterbegin", invalidInputsAlert);
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
        bookmarkNameInput.focus();
    }
}); 
confirmDeleteButton.addEventListener("click", () => {
    const index = deleteModal.getAttribute("data-index");
    bookmarkList.splice(index, 1);
    localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
    const modalInstance = bootstrap.Modal.getInstance(deleteModal);
    if (modalInstance) {
        modalInstance.hide();
    }
        renderBookmarks();
});
function clearLocalStorage() {
    localStorage.removeItem("bookmarkList");
    bookmarkList = [];
    renderBookmarks();
}