document.addEventListener("DOMContentLoaded", () => {
    const pageManager = new PageManager(
        "fileInput",
        "formContainer",
        "submitBtn",
        "downloadBtn"
    );
    pageManager.init();
});

class PageManager {
    constructor(fileInputId, formContainerId, submitBtnId, downloadBtnId) {
        this.fileInput = document.getElementById(fileInputId);
        this.formContainer = document.getElementById(formContainerId);
        this.submitBtn = document.getElementById(submitBtnId);
        this.downloadBtn = document.getElementById(downloadBtnId);
        this.originalContent = ""; // 元のファイルの内容を保持する変数
        this.inputs = []; // 入力フィールドの情報を保持する配列
    }

    // 初期化処理
    init() {
        this.fileInput.addEventListener("change", (event) =>
            this.handleFileSelect(event)
        );
        this.submitBtn.addEventListener("click", () => this.handleSubmit());
    }

    // ファイル選択時の処理
    handleFileSelect(event) {
        const file = event.target.files[0];
        this.fileName = file.name;
        console.log(this.fileName);
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalContent = e.target.result; // 元のファイル内容を保持
            this.generateForm();
        };
        reader.readAsText(file);
    }

    // フォームを生成する処理
    generateForm() {
        const lines = this.originalContent.split("\n");
        this.formContainer.innerHTML = ""; // 前の内容をクリア

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine.includes(":")) {
                const [key] = trimmedLine.split(":");
                this.createInputField(key.trim());
            }
        });

        this.formContainer.style.display = "block";
        this.submitBtn.style.display = "block";
    }

    // 入力フィールドを生成
    createInputField(key) {
        const inputField = document.createElement("div");
        let defaultValue = "";
        if (key === "password") {
            defaultValue = this.getFromLocalStrage(key) || "";
        }
        if (key === "ceid") {
            defaultValue = this.getFromLocalStrage(key) || "";
        }
        inputField.classList.add("inputField", "form-group");
        inputField.innerHTML = `
            <label  for="${key}">${key}:</label>
            <input type="text" class="form-control" id="${key}" value="${defaultValue}" required/>
        `;
        this.inputs.push(key);
        this.formContainer.appendChild(inputField);
    }

    // submit時の処理
    handleSubmit() {
        const outputContent = this.originalContent
            .split("\n")
            .map((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine.includes(":")) {
                    const key = trimmedLine.split(":")[0].trim();
                    const value = document.getElementById(key)?.value || ""; // 入力値を取得
                    if (key === "password") {
                        console.log(key, value);
                        this.saveToLocalStrage(key, value);
                    }
                    if (key === "ceid") {
                        this.saveToLocalStrage(key, value);
                        console.log(key, value);
                    }
                    return `${key}: ${value}`; // キーと値を結合
                }
                return line; // コメント行はそのまま返す
            })
            .join("\n");

        this.createDownloadLink(outputContent);
    }
    // ダウンロードリンクを作成
    createDownloadLink(content) {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        this.downloadBtn.href = url;
        this.downloadBtn.download = `output_${this.fileName}`;
        this.downloadBtn.style.display = "block";
        this.downloadBtn.textContent = "ダウンロード";
    }

    saveToLocalStrage(key, value) {
        localStorage.setItem(key, value);
    }

    getFromLocalStrage(key) {
        return localStorage.getItem(key);
    }
}
