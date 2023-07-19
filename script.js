const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("CarDatabase", 1); // version number (2nd param) used for updating db

request.onerror = function (event) {
    console.error("An error occurred with IndexedDB")
    console.error(event)
}

request.onupgradeneeded = function () { // runs when db version is upgraded or when db is first created.
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });
    store.createIndex("cars_colour", ["colour"], { unique: false });
    store.createIndex("colour_and_make", ["colour", "make"], {
        unique: false,
    });
};

request.onsuccess = function () {
    console.log("Database opened successfully");

    const db = request.result;

    // 1
    const transaction = db.transaction("cars", "readwrite");

    //2
    const store = transaction.objectStore("cars");
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");

    //3
    store.put({ id: 1, colour: "Red", make: "Toyota" });
    store.put({ id: 2, colour: "Red", make: "Kia" });
    store.put({ id: 3, colour: "Blue", make: "Honda" });
    store.put({ id: 4, colour: "Silver", make: "Subaru" });

    //4
    const idQuery = store.get(4);
    const colourQuery = colourIndex.getAll(["Red"]);
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);

    // 5
    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
    };
    colourQuery.onsuccess = function () {
        console.log('colourQuery', colourQuery.result);
    };
    colourMakeQuery.onsuccess = function () {
        console.log('colourMakeQuery', colourMakeQuery.result);
    };

    // 6
    transaction.oncomplete = function () {
        db.close();
    };
};


// initDB function which creates/upgrades db
// update function
// add function
// delete function

// https://www.youtube.com/watch?v=yZ26CXny3iI
// https://dev.to/alexeagleson/how-to-use-indexeddb-to-store-data-for-your-web-application-in-the-browser-1o90