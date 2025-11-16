/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_rsc_src_lib_firebase_ts";
exports.ids = ["_rsc_src_lib_firebase_ts"];
exports.modules = {

/***/ "?27d4":
/*!************************!*\
  !*** undici (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?aa35":
/*!************************!*\
  !*** undici (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "(rsc)/./src/lib/firebase.ts":
/*!*****************************!*\
  !*** ./src/lib/firebase.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   db: () => (/* binding */ db),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   storage: () => (/* binding */ storage)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"(rsc)/./node_modules/firebase/app/dist/index.mjs\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"(rsc)/./node_modules/firebase/auth/dist/index.mjs\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ \"(rsc)/./node_modules/firebase/firestore/dist/index.mjs\");\n/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/storage */ \"(rsc)/./node_modules/firebase/storage/dist/index.mjs\");\n\n\n\n\nconst firebaseConfig = {\n    apiKey: \"AIzaSyAhYUelLCS8ItJwaltcjtUl8HHJwp605T0\",\n    authDomain: \"arida-c5faf.firebaseapp.com\",\n    projectId: \"arida-c5faf\",\n    storageBucket: \"arida-c5faf.firebasestorage.app\",\n    messagingSenderId: \"446881275370\",\n    appId: \"1:446881275370:web:283f0360cfab3556a32693\"\n};\n// Debug: Log Firebase configuration\nconsole.log(\"\\uD83D\\uDD27 Firebase Config:\", {\n    projectId: firebaseConfig.projectId,\n    authDomain: firebaseConfig.authDomain\n});\n// Initialize Firebase\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\n// Initialize Firebase services\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(app);\nconst db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)(app);\nconst storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__.getStorage)(app);\n// Debug: Log database info\nconsole.log(\"\\uD83D\\uDD27 Firestore app:\", app.name);\nconsole.log(\"\\uD83D\\uDD27 Firestore project:\", app.options.projectId);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2ZpcmViYXNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTZDO0FBQ0w7QUFDVTtBQUNKO0FBRTlDLE1BQU1JLGlCQUFpQjtJQUNyQkMsUUFBUUMseUNBQXdDO0lBQ2hERyxZQUFZSCw2QkFBNEM7SUFDeERLLFdBQVdMLGFBQTJDO0lBQ3RETyxlQUFlUCxpQ0FBK0M7SUFDOURTLG1CQUFtQlQsY0FBb0Q7SUFDdkVXLE9BQU9YLDJDQUF1QztBQUNoRDtBQUVBLG9DQUFvQztBQUNwQ2EsUUFBUUMsR0FBRyxDQUFDLGlDQUF1QjtJQUNqQ1QsV0FBV1AsZUFBZU8sU0FBUztJQUNuQ0YsWUFBWUwsZUFBZUssVUFBVTtBQUN2QztBQUVBLHNCQUFzQjtBQUN0QixNQUFNWSxNQUFNckIsMkRBQWFBLENBQUNJO0FBRTFCLCtCQUErQjtBQUN4QixNQUFNa0IsT0FBT3JCLHNEQUFPQSxDQUFDb0IsS0FBSztBQUMxQixNQUFNRSxLQUFLckIsZ0VBQVlBLENBQUNtQixLQUFLO0FBQzdCLE1BQU1HLFVBQVVyQiw0REFBVUEsQ0FBQ2tCLEtBQUs7QUFFdkMsMkJBQTJCO0FBQzNCRixRQUFRQyxHQUFHLENBQUMsK0JBQXFCQyxJQUFJSSxJQUFJO0FBQ3pDTixRQUFRQyxHQUFHLENBQUMsbUNBQXlCQyxJQUFJSyxPQUFPLENBQUNmLFNBQVM7QUFFMUQsaUVBQWVVLEdBQUdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8zYXJpZGEtcGV0aXRpb24tcGxhdGZvcm0vLi9zcmMvbGliL2ZpcmViYXNlLnRzPzE1NDAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBnZXRBdXRoIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XG5pbXBvcnQgeyBnZXRGaXJlc3RvcmUgfSBmcm9tICdmaXJlYmFzZS9maXJlc3RvcmUnO1xuaW1wb3J0IHsgZ2V0U3RvcmFnZSB9IGZyb20gJ2ZpcmViYXNlL3N0b3JhZ2UnO1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BUElfS0VZLFxuICBhdXRoRG9tYWluOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BVVRIX0RPTUFJTixcbiAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9QUk9KRUNUX0lELFxuICBzdG9yYWdlQnVja2V0OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9TVE9SQUdFX0JVQ0tFVCxcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQsXG4gIGFwcElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BUFBfSUQsXG59O1xuXG4vLyBEZWJ1ZzogTG9nIEZpcmViYXNlIGNvbmZpZ3VyYXRpb25cbmNvbnNvbGUubG9nKCfwn5SnIEZpcmViYXNlIENvbmZpZzonLCB7XG4gIHByb2plY3RJZDogZmlyZWJhc2VDb25maWcucHJvamVjdElkLFxuICBhdXRoRG9tYWluOiBmaXJlYmFzZUNvbmZpZy5hdXRoRG9tYWluLFxufSk7XG5cbi8vIEluaXRpYWxpemUgRmlyZWJhc2VcbmNvbnN0IGFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuXG4vLyBJbml0aWFsaXplIEZpcmViYXNlIHNlcnZpY2VzXG5leHBvcnQgY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcbmV4cG9ydCBjb25zdCBkYiA9IGdldEZpcmVzdG9yZShhcHApO1xuZXhwb3J0IGNvbnN0IHN0b3JhZ2UgPSBnZXRTdG9yYWdlKGFwcCk7XG5cbi8vIERlYnVnOiBMb2cgZGF0YWJhc2UgaW5mb1xuY29uc29sZS5sb2coJ/CflKcgRmlyZXN0b3JlIGFwcDonLCBhcHAubmFtZSk7XG5jb25zb2xlLmxvZygn8J+UpyBGaXJlc3RvcmUgcHJvamVjdDonLCBhcHAub3B0aW9ucy5wcm9qZWN0SWQpO1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUFwcCIsImdldEF1dGgiLCJnZXRGaXJlc3RvcmUiLCJnZXRTdG9yYWdlIiwiZmlyZWJhc2VDb25maWciLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfQVBJX0tFWSIsImF1dGhEb21haW4iLCJORVhUX1BVQkxJQ19GSVJFQkFTRV9BVVRIX0RPTUFJTiIsInByb2plY3RJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX1BST0pFQ1RfSUQiLCJzdG9yYWdlQnVja2V0IiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQiLCJhcHBJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX0FQUF9JRCIsImNvbnNvbGUiLCJsb2ciLCJhcHAiLCJhdXRoIiwiZGIiLCJzdG9yYWdlIiwibmFtZSIsIm9wdGlvbnMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/firebase.ts\n");

/***/ })

};
;