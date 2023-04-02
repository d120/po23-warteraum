"use strict";

const MAX_SWAPS = 10;
const MIN_SWAPS = 5;
const MAX_WAIT_TIME = 60;  // seconds
const MIN_WAIT_TIME = 10;  // seconds

const makeModule = (title, credits, type) => ({
    placeholder: !title,
    title,
    credits,
    type: type || "compulsory",
});

const s = (time) => time * 1000;  // converts seconds to milliseconds

const randomInt = (min, max) =>  Math.floor(Math.random() * (max - min + 1)) + min;

const semesters = [
    [
        makeModule("Funktionale und objektorientierte Programmierkonzepte", 10),
        makeModule("Digitaltechnik", 5),
        makeModule("Mathematik I", 9),
        makeModule("Automaten, formale Sprachen und Entscheidbarkeit", 5),
        makeModule("Mentorensystem", 0),
        makeModule(),
    ],
    [
        makeModule("Algorithmen und Datenstrukturen", 10),
        makeModule("Rechnerorganisation", 5),
        makeModule("Mathematik II", 9),
        makeModule("Aussagen- und Prädikatenlogik", 5),
        makeModule(),
        makeModule(),
    ],
    [
        makeModule("Software Engineering", 5),
        makeModule("Computersystemsicherheit", 5),
        makeModule("Einführung in den Compilerbau", 5),
        makeModule("Architekturen und Entwurf von Rechnersystemen", 5),
        makeModule("Systemnahe und parallele Programmierung", 5),
        makeModule("Modellierung, Spezifikation und Semantik", 5),
    ],
    [
        makeModule("Informationsmanagement", 5),
        makeModule("Computational Engineering und Robotik", 5),
        makeModule("Computer-Netzwerke und verteilte Systeme", 5),
        makeModule("Mathematik III", 8),
        makeModule("Formale Methoden im Softwareentwurf", 5),
        makeModule("Fachübergreifende Lehrveranstaltungen", 3, "generale"),
    ],
    [
        makeModule("Betriebssysteme", 5),
        makeModule("Visual Computing", 5),
        makeModule("Bachelorpraktikum", 9),
        makeModule("Wahlbereich Fachprüfungen", 6, "elective"),
        makeModule("Wahlbereich Seminare", 3, "elective"),
        makeModule("Fachübergreifende Lehrveranstaltungen", 3, "generale"),
    ],
    [
        makeModule("Bachelor-Thesis", 12, "thesis"),
        makeModule("Wahlbereich Fachprüfungen", 12, "elective"),
        makeModule("Wahlbereich Praktika", 6, "elective"),
        makeModule(),
        makeModule(),
        makeModule(),
    ],
];

const refreshModules = () => {
    const $plan = document.querySelector("#plan");
    $plan.innerHTML = "";
    let semesterIdx = 0;
    for (const semester of semesters) {
        const $semester = document.createElement("div");
        $plan.appendChild($semester);
        $semester.classList.add("semester");

        const $header = document.createElement("div");
        $semester.appendChild($header);
        $header.classList.add("header");
        const $headerTitle = document.createElement("span");
        $header.appendChild($headerTitle);
        $headerTitle.innerText = `${semesterIdx + 1}. Semester`;

        let moduleIdx = 0;
        for (const module of semester) {
            const $module = document.createElement("div");
            $semester.appendChild($module);
            $module.classList.add("module");
            $module.classList.add(module.type);
            $module.setAttribute("data-semester-idx", semesterIdx);
            $module.setAttribute("data-module-idx", moduleIdx);

            if (module.placeholder) {
                $module.classList.add("placeholder");
            } else {
                const $moduleTitle = document.createElement("span");
                $module.appendChild($moduleTitle);
                $moduleTitle.innerText = module.title;

                const $credits = document.createElement("span");
                $module.appendChild($credits);
                $credits.innerText = `(${module.credits} CP)`;
            }

            moduleIdx++;
        }

        semesterIdx++;
    }
};

const pickRandomModule = () => {
    const $modules = document.querySelectorAll(".module");
    return $modules[randomInt(0, $modules.length - 1)];
};

const swap = ($moduleA, $moduleB, callback) => {
    $moduleA.classList.add("transition");
    $moduleB.classList.add("transition");
    const moduleAFinalX = $moduleB.getBoundingClientRect().left - $moduleA.getBoundingClientRect().left;
    const moduleAFinalY = $moduleB.getBoundingClientRect().top  - $moduleA.getBoundingClientRect().top;
    const moduleBFinalX = $moduleA.getBoundingClientRect().left - $moduleB.getBoundingClientRect().left;
    const moduleBFinalY = $moduleA.getBoundingClientRect().top  - $moduleB.getBoundingClientRect().top;
    $moduleA.style.transform = `translate(${moduleAFinalX}px, ${moduleAFinalY}px)`;
    $moduleB.style.transform = `translate(${moduleBFinalX}px, ${moduleBFinalY}px)`;

    const moduleASemesterIdx = $moduleA.getAttribute("data-semester-idx");
    const moduleBSemesterIdx = $moduleB.getAttribute("data-semester-idx");
    const moduleAModuleIdx = $moduleA.getAttribute("data-module-idx");
    const moduleBModuleIdx = $moduleB.getAttribute("data-module-idx");
    const tmp = semesters[moduleBSemesterIdx][moduleBModuleIdx];
    semesters[moduleBSemesterIdx][moduleBModuleIdx] = semesters[moduleASemesterIdx][moduleAModuleIdx];
    semesters[moduleASemesterIdx][moduleAModuleIdx] = tmp;

    setTimeout(() => {
        refreshModules();
        $moduleA.classList.remove("transition");
        $moduleB.classList.remove("transition");
        $moduleA.removeAttribute("style");
        $moduleB.removeAttribute("style");
        callback();
    }, s(0.2));  // timeout must be synchronized with CSS rules
};

const swapRandomModules = (callback) => {
    console.log("swapping two random modules");
    const $modules = document.querySelectorAll(".module");
    const moduleAIdx = randomInt(0, $modules.length - 1);
    // reject saples until we found a module that is not module A
    let moduleBIdx = undefined;
    do {
        moduleBIdx = randomInt(0, $modules.length - 1);
    } while (moduleAIdx === moduleBIdx);
    const $moduleA = $modules[moduleAIdx];
    const $moduleB = $modules[moduleBIdx];
    swap($moduleA, $moduleB, callback);
};

const startSwapBatch = (callback) => {
    callback = callback || (() => {});
    const swaps = randomInt(MIN_SWAPS, MAX_SWAPS);
    console.log(`starting swap batch with ${swaps} swaps`);
    let counter = 0;
    const countSwap = () => {
        counter++;
        if (counter <= swaps) {
            swapRandomModules(countSwap);
        } else {
            callback();
        }
    };
    countSwap();
};

const startPeriodicSwapping = (first) => {
    const waitTime = first ? 0 : randomInt(MIN_WAIT_TIME, MAX_WAIT_TIME);
    console.log(`waiting ${waitTime} seconds before next swap batch`);
    setTimeout(() => {
        startSwapBatch(() => {
            startPeriodicSwapping();
        });
    }, s(waitTime));
};

document.addEventListener("DOMContentLoaded", () => {
    refreshModules();
    startPeriodicSwapping(true);
});
