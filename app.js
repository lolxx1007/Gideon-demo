document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("gideon-form");

    const officerName = document.getElementById("officer-name");
    const unitSelect = document.getElementById("unit-select");
    const reportType = document.getElementById("report-type");

    const status = document.getElementById("status");
    const result = document.getElementById("result");
    const notes = document.getElementById("notes");

    const nextBtn = document.getElementById("next-btn");
    const summaryBtn = document.getElementById("summary-btn");

    const backBtn = document.getElementById("back-btn");
    const resetBtn = document.getElementById("reset-btn");
    const editBtn = document.getElementById("edit-btn");
    const finishBtn = document.getElementById("finish-btn");

    const geoAlert = document.getElementById("geo-alert");

    const steps = document.querySelectorAll(".step");
    const progressItems = document.querySelectorAll(".progress-item");

    const unitNames = {
        "bila-tserkva": "Білоцерківський район",
        "boryspil": "Бориспільський район",
        "brovary": "Броварський район",
        "bucha": "Бучанський район",
        "vyshhorod": "Вишгородський район",
        "obukhiv": "Обухівський район",
        "fastiv": "Фастівський район"
    };

    const reportNames = {
        units: "Підрозділи",
        messages: "Ввідні повідомлення",
        special: "Спец. об'єкти"
    };

    const statusNames = {
        completed: "Перевірку завершено",
        partial: "Виконано частково",
        problem: "Виявлено зауваження"
    };

    let currentStep = 1;

    function validateStep1() {
        const valid =
            officerName.value.trim() !== "" &&
            unitSelect.value !== "";

        nextBtn.disabled = !valid;
    }

    function validateStep2() {
        const valid =
            status.value !== "" &&
            result.value.trim() !== "";

        summaryBtn.disabled = !valid;
    }

    function showStep(number) {
        currentStep = number;

        steps.forEach(step => {
            step.classList.remove("active");
        });

        document
            .querySelector(`[data-step="${number}"]`)
            .classList.add("active");

        progressItems.forEach((item, index) => {
            item.classList.remove("active");

            if (index + 1 < number) {
                item.classList.add("completed");
            } else {
                item.classList.remove("completed");
            }

            if (index + 1 === number) {
                item.classList.add("active");
            }
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function saveDraft() {
        const draft = {
            officerName: officerName.value,
            unitSelect: unitSelect.value,
            reportType: reportType.value,
            status: status.value,
            result: result.value,
            notes: notes.value
        };

        localStorage.setItem(
            "gideon_demo_draft",
            JSON.stringify(draft)
        );
    }

    function loadDraft() {
        const saved = localStorage.getItem("gideon_demo_draft");

        if (!saved) {
            return;
        }

        try {
            const draft = JSON.parse(saved);

            officerName.value = draft.officerName || "";
            unitSelect.value = draft.unitSelect || "";
            reportType.value = draft.reportType || "units";
            status.value = draft.status || "";
            result.value = draft.result || "";
            notes.value = draft.notes || "";

            validateStep1();
            validateStep2();

        } catch {
            localStorage.removeItem("gideon_demo_draft");
        }
    }

    function createSummary() {
        document.getElementById("summary-report").textContent =
            reportNames[reportType.value] || "—";

        document.getElementById("summary-officer").textContent =
            officerName.value || "—";

        document.getElementById("summary-unit").textContent =
            unitNames[unitSelect.value] || "—";

        document.getElementById("summary-status").textContent =
            statusNames[status.value] || "—";

        document.getElementById("summary-result").textContent =
            result.value || "—";
    }

    nextBtn.addEventListener("click", () => {
        saveDraft();
        showStep(2);
    });

    backBtn.addEventListener("click", () => {
        saveDraft();
        showStep(1);
    });

    summaryBtn.addEventListener("click", () => {
        saveDraft();
        createSummary();
        showStep(3);
    });

    editBtn.addEventListener("click", () => {
        showStep(2);
    });

    finishBtn.addEventListener("click", () => {
        alert("Демонстраційний звіт завершено.");
        localStorage.removeItem("gideon_demo_draft");

        form.reset();

        validateStep1();
        validateStep2();

        showStep(1);
    });

    resetBtn.addEventListener("click", () => {
        form.reset();

        localStorage.removeItem("gideon_demo_draft");

        validateStep1();
        validateStep2();

        showStep(1);
    });

    [
        officerName,
        unitSelect,
        reportType,
        status,
        result,
        notes
    ].forEach(element => {

        element.addEventListener("input", () => {
            validateStep1();
            validateStep2();
            saveDraft();
        });

        element.addEventListener("change", () => {
            validateStep1();
            validateStep2();
            saveDraft();
        });

    });

    if ("geolocation" in navigator) {

        navigator.geolocation.getCurrentPosition(
            () => {
                geoAlert.classList.add("hidden");
            },
            () => {
                geoAlert.classList.remove("hidden");
            }
        );

    } else {
        geoAlert.classList.remove("hidden");
    }

    loadDraft();

    validateStep1();
    validateStep2();

});
