"use strict";

const makeModule = (title, credits, type) => ({ title, credits, type: type || "compulsory" });

const semesters = [
    [
        makeModule("Funktionale und objektorientierte Programmierkonzepte", 10),
        makeModule("Digitaltechnik", 5),
        makeModule("Mathematik I", 9),
        makeModule("Automaten, formale Sprachen und Entscheidbarkeit", 5),
        makeModule("Mentorensystem", 0),
    ],
    [
        makeModule("Algorithmen und Datenstrukturen", 10),
        makeModule("Rechnerorganisation", 5),
        makeModule("Mathematik II", 9),
        makeModule("Aussagen- und Prädikatenlogik", 5),
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
        makeModule("Formale Methoden im Softwareentwurf", 5)
    ],
    [
        makeModule("Betriebssysteme", 5),
        makeModule("Visual Computing", 5),
        makeModule("Bachelorpraktikum", 9),
    ],
    [
        makeModule("Bachelor-Thesis", 12, "thesis"),
    ],
];

const displayModules = () => {
    const $plan = document.querySelector("#plan");
    let i = 1;
    for (const semester of semesters) {
        const $semester = document.createElement("div");
        $plan.appendChild($semester);
        $semester.classList.add("semester");

        const $header = document.createElement("div");
        $semester.appendChild($header);
        $header.classList.add("header");
        const $headerTitle = document.createElement("span");
        $header.appendChild($headerTitle);
        $headerTitle.innerText = `${i}. Semester`;

        for (const module of semester) {
            const $module = document.createElement("div");
            $semester.appendChild($module);
            $module.classList.add("module");
            $module.classList.add(module.type);

            const $moduleTitle = document.createElement("span");
            $module.appendChild($moduleTitle);
            $moduleTitle.innerText = module.title;

            const $credits = document.createElement("span");
            $module.appendChild($credits);
            $credits.innerText = `(${module.credits} CP)`;
        }

        i++;
    }
};

const pickRandomModule = () => {
    const $modules = document.querySelectorAll(".module");
    return $modules[Math.floor(Math.random() * $modules.length)];
};

const swap = (moduleA, moduleB) => {
    moduleA.classList.add("transition");
    moduleB.classList.add("transition");
    const moduleAFinalX = moduleB.getBoundingClientRect().left - moduleA.getBoundingClientRect().left;
    const moduleAFinalY = moduleB.getBoundingClientRect().top  - moduleA.getBoundingClientRect().top;
    const moduleBFinalX = moduleA.getBoundingClientRect().left - moduleB.getBoundingClientRect().left;
    const moduleBFinalY = moduleA.getBoundingClientRect().top  - moduleB.getBoundingClientRect().top;
    moduleA.style.transform = `translate(${moduleAFinalX}px, ${moduleAFinalY}px)`;
    moduleB.style.transform = `translate(${moduleBFinalX}px, ${moduleBFinalY}px)`;
    /*
    setTimeout(() => {
        //moduleB.parentElement.insertBefore(moduleB, moduleA);
        moduleA.classList.remove("transition");
        moduleB.classList.remove("transition");
        moduleA.removeAttribute("style");
        moduleB.removeAttribute("style");
    }, 1000);
    */
};

document.addEventListener("DOMContentLoaded", () => {
    console.log('loaded');
    displayModules();
    console.log(pickRandomModule());

    setInterval(() => swap(pickRandomModule(), pickRandomModule()), 1000);
});
