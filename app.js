document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("gideon-form");

    const officerName = document.getElementById("officer-name");
    const unitSelect = document.getElementById("unit-select");
    const reportType = document.getElementById("report-type");

    const status = document.getElementById("status");
    const result = document.getElementById("result");
    const notes = document.getElementById("notes");

    const nextBtn = document.getElementById("next-btn");
    const backBtn = document.getElementById("back-btn");
    const summaryBtn = document.getElementById("summary-btn");

    const resetBtn = document.getElementById("reset-btn");
    const editBtn = document.getElementById("edit-btn");
    const finishBtn = document.getElementById("finish-btn");

    const geoAlert = document.getElementById("geo-alert");
    const closeAlert = document.getElementById("close-alert");

    const steps = document.querySelectorAll(".step");
    const sideSteps = document.querySelectorAll(".side-step");

    let currentStep = 1;

    function validateStep1() {

        const valid =
            reportType.value.trim() !== "" &&
            officerName.value.trim() !== "" &&
            unitSelect.value.trim() !== "";

        nextBtn.disabled = !valid;
    }

    function validateStep2() {

        const valid =
            status.value.trim() !== "" &&
            result.value.trim() !== "";

        summaryBtn.disabled = !valid;
    }

    function showStep(number) {

        currentStep = number;

        steps.forEach(step => {
            step.classList.remove("active");
        });

        const selectedStep =
            document.querySelector(`[data-step="${number}"]`);

        if (selectedStep) {
            selectedStep.classList.add("active");
        }

        sideSteps.forEach((step, index) => {

            step.classList.remove("active");
            step.classList.remove("completed");

            if (index + 1 < number) {
                step.classList.add("completed");
            }

            if (index + 1 === number) {
                step.classList.add("active");
            }

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function saveDraft() {

        const draft = {

            reportType: reportType.value,
            officerName: officerName.value,
            unitSelect: unitSelect.value,

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

        const saved =
            localStorage.getItem("gideon_demo_draft");

        if (!saved) {
            return;
        }

        try {

            const draft = JSON.parse(saved);

            reportType.value =
                draft.reportType || "";

            officerName.value =
                draft.officerName || "";

            unitSelect.value =
                draft.unitSelect || "";

            status.value =
                draft.status || "";

            result.value =
                draft.result || "";

            notes.value =
                draft.notes || "";

        } catch {

            localStorage.removeItem(
                "gideon_demo_draft"
            );

        }

        validateStep1();
        validateStep2();
    }

    function createSummary() {

        document.getElementById("summary-report").textContent =
            reportType.value || "—";

        document.getElementById("summary-officer").textContent =
            officerName.value || "—";

        document.getElementById("summary-unit").textContent =
            unitSelect.value || "—";

        document.getElementById("summary-status").textContent =
            status.value || "—";

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

        alert("Звіт успішно завершено.");

        localStorage.removeItem(
            "gideon_demo_draft"
        );

        form.reset();

        validateStep1();
        validateStep2();

        showStep(1);

    });

    resetBtn.addEventListener("click", () => {

        form.reset();

        localStorage.removeItem(
            "gideon_demo_draft"
        );

        validateStep1();
        validateStep2();

        showStep(1);

    });

    closeAlert.addEventListener("click", () => {

        geoAlert.classList.add("hidden");

    });

    [
        reportType,
        officerName,
        unitSelect,
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
