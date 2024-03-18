document.addEventListener("DOMContentLoaded", function () {
	const SubmitButton = document.getElementById("inputBook");
	SubmitButton.addEventListener("submit", function (event) {
		event.preventDefault();
		addBookShelf();
	});
	function addBookShelf() {
		const inputBookTitle = document.querySelector("#inputBookTitle").value;
		const inputBookAuthor = document.querySelector("#inputBookAuthor").value;
		const inputBookYear = document.querySelector("#inputBookYear").value;
		const inputBookIsComplete = document.querySelector("#inputBookIsComplete").checked;
		const MakeID = makeID();
		const BookshelfObject = bookShelfObject(MakeID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
		WareHouseArray.push(BookshelfObject);
		WareHouseArray.sort((a, b) => {
			return b.year - a.year;
		});
		document.dispatchEvent(new Event(RENDER));
	}
	function makeID() {
		return +new Date();
	}
	function bookShelfObject(id, title, author, yearBook, isComplete) {
		const year = parseInt(yearBook);
		return {
			id,
			title,
			author,
			year,
			isComplete,
		};
	}
	const WareHouseArray = [];
	const RENDER = "render-event";
	document.addEventListener(RENDER, function () {
		const incompleteShelf = document.getElementById("incompleteBookshelfList");
		incompleteShelf.innerHTML = "";
		const completeShelf = document.getElementById("completeBookshelfList");
		completeShelf.innerHTML = "";
		for (const bookItem of WareHouseArray) {
			const bookElement = moveShelf(bookItem);
			if (bookItem.isComplete) {
				completeShelf.append(bookElement);
			} else {
				incompleteShelf.append(bookElement);
			}
		}
		saveBook();
	});
	function moveShelf(ShelfObject) {
		const article = document.createElement("article");
		article.classList.add("book_item");
		const h2Title = document.createElement("h2");
		const pAuthor = document.createElement("p");
		const pYear = document.createElement("p");
		h2Title.innerHTML = ShelfObject.title;
		pAuthor.innerHTML = `Penulis: ${ShelfObject.author}`;
		pYear.innerHTML = `Tahun: ${ShelfObject.year}`;
		article.append(h2Title, pAuthor, pYear);
		const CekTrueCheckBox = ShelfObject.isComplete;
		const kotakButton = document.createElement("div");
		kotakButton.classList.add("action");
		if (!CekTrueCheckBox) {
			const selesaiButton = document.createElement("button");
			selesaiButton.id = ShelfObject.id;
			selesaiButton.innerText = "Selesai Baca";
			selesaiButton.classList.add("green");
			selesaiButton.addEventListener("click", function () {
				selesaiButtonFunc(ShelfObject.id);
			});
			const hapusButton = document.createElement("button");
			hapusButton.id = ShelfObject.id;
			hapusButton.innerText = "Hapus buku";
			hapusButton.classList.add("red");
			hapusButton.addEventListener("click", function () {
				hapusButtonFunc(ShelfObject.id);
			});
			kotakButton.appendChild(selesaiButton);
			kotakButton.appendChild(hapusButton);
			article.append(kotakButton);
		} else if (CekTrueCheckBox) {
			const belumButton = document.createElement("button");
			belumButton.id = ShelfObject.id;
			belumButton.innerText = "Belum Baca";
			belumButton.classList.add("green");
			belumButton.addEventListener("click", function () {
				belumButtonFunc(ShelfObject.id);
			});
			const hapusButton = document.createElement("button");
			hapusButton.id = ShelfObject.id;
			hapusButton.innerText = "Hapus buku";
			hapusButton.classList.add("red");
			hapusButton.addEventListener("click", function () {
				hapusButtonFunc(ShelfObject.id);
			});
			kotakButton.appendChild(belumButton);
			kotakButton.appendChild(hapusButton);
			article.append(kotakButton);
		}
		return article;
		function selesaiButtonFunc(ShelfId) {
			const bookTarget = findBook(ShelfId);
			if (bookTarget == null) return;
			bookTarget.isComplete = true;
			document.dispatchEvent(new Event(RENDER));
		}
		function belumButtonFunc(ShelfId) {
			const bookTarget = findBook(ShelfId);
			if (bookTarget == null) return;
			bookTarget.isComplete = false;
			document.dispatchEvent(new Event(RENDER));
		}
		function findBook(ShelfId) {
			for (const bookItem of WareHouseArray) {
				if (bookItem.id === ShelfId) {
					return bookItem;
				}
			}
			return null;
		}
		function hapusButtonFunc(bookId) {
			const bookTarget = hapusIndex(bookId);
			if (bookTarget === -1) return;
			WareHouseArray.splice(bookTarget, 1);
			document.dispatchEvent(new Event(RENDER));
		}
		function hapusIndex(bookId) {
			for (const index in WareHouseArray) {
				if (WareHouseArray[index].id === bookId) {
					alert(`item buku dengan id ${WareHouseArray[index].id} sudah dihapus `);
					return index;
				}
			}
			return -1;
		}
	}
	function cekStorage() {
		if (typeof Storage === undefined) {
			alert("maaf bang device anda tidak mendukung localStorage");
			return false;
		}
		return true;
	}
	function saveBook() {
		if (cekStorage()) {
			const JSONString = JSON.stringify(WareHouseArray);
			localStorage.setItem(STORAGE_KEY, JSONString);
			document.dispatchEvent(new Event(SAVED));
		} else {
			alert("maaf bang device anda tidak mendukung localStorage");
		}
	}
	const SAVED = "saved-book";
	const STORAGE_KEY = "BOOK_SHELF";
	document.addEventListener(SAVED, function () {
		localStorage.getItem(STORAGE_KEY);
	});
	function loadDataFromStorage() {
		const dataFromLocal = localStorage.getItem(STORAGE_KEY);
		let data = JSON.parse(dataFromLocal);
		if (data !== null) {
			for (const book of data) {
				WareHouseArray.push(book);
			}
		}
		document.dispatchEvent(new Event(RENDER));
	}
	if (cekStorage()) {
		loadDataFromStorage();
	}
});
