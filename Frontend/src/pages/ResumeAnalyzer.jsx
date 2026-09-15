import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/resumeService";

const Card = ({ title, children }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">
            {title}
        </h3>

        {children}
    </div>
);

export default function ResumeAnalyzer() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(() => {
        const saved = sessionStorage.getItem(
            "nexora_resume_analysis"
        );

        return saved ? JSON.parse(saved) : null;
    });

    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!file) {
            return alert("Please upload your resume.");
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const response = await analyzeResume(file);

            setResult(response.analysis);

            sessionStorage.setItem(
                "nexora_resume_analysis",
                JSON.stringify(response.analysis)
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const askNexora = (recommendation) => {
        localStorage.setItem(
            "nexora_resume_prompt",
            `Help me with this resume recommendation:\n\n${recommendation}`
        );

        window.dispatchEvent(
            new Event("nexora-resume-prompt")
        );

        navigate("/");
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">

            {/* Top Bar */}
            <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6">

                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-[#14B8A6] text-[#061411] flex items-center justify-center font-bold">
                        N
                    </div>

                    <span className="font-semibold text-lg">
                        Nexora
                    </span>

                    <span className="text-neutral-600">
                        /
                    </span>

                    <span className="text-neutral-400">
                        Resume Analyzer
                    </span>

                </div>

                <button
                    onClick={() => navigate("/")}
                    className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition flex items-center justify-center"
                    title="Back to Chat"
                >
                    💬
                </button>

            </div>

            {/* Main */}
            <main className="max-w-4xl mx-auto px-6 py-16">

                {/* Heading */}
                <div className="text-center mb-12">

                    <div className="text-5xl mb-5">
                        📄
                    </div>

                    <h1 className="text-4xl font-semibold mb-4">
                        Resume Analyzer
                    </h1>

                    <p className="text-neutral-500">
                        Upload your resume and let Nexora analyze it.
                    </p>

                </div>

                {/* Upload */}
                <div className="max-w-2xl mx-auto">

                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">

                        <label className="block cursor-pointer">

                            <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl p-12 text-center transition">

                                <div className="text-3xl mb-4">
                                    {file ? "✓" : "↑"}
                                </div>

                                <h2 className="text-lg font-medium mb-2">
                                    {file
                                        ? "Resume selected"
                                        : "Drop your resume here"}
                                </h2>

                                <p className="text-sm text-neutral-500 mb-5 truncate">
                                    {file
                                        ? file.name
                                        : "or click to browse your files"}
                                </p>

                                {!file && (
                                    <span className="inline-block px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium">
                                        Choose File
                                    </span>
                                )}

                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const selected =
                                            e.target.files[0];

                                        if (
                                            selected?.type !==
                                            "application/pdf"
                                        ) {
                                            alert(
                                                "Please upload a PDF"
                                            );
                                            return;
                                        }

                                        setFile(selected);
                                        setError("");
                                    }}
                                    hidden
                                />

                            </div>

                        </label>

                        {/* Selected File */}
                        {file && (
                            <div className="mt-5 flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3">

                                <span className="truncate">
                                    📄 {file.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setResult(null);

                                        sessionStorage.removeItem(
                                            "nexora_resume_analysis"
                                        );
                                    }}
                                    className="text-neutral-500 hover:text-red-400 ml-3"
                                >
                                    ×
                                </button>

                            </div>
                        )}

                        {/* Analyze */}
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            className="w-full mt-6 py-3.5 rounded-xl bg-[#14B8A6] text-[#061411] font-medium hover:bg-[#2DD4BF] transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Analyzing Resume..."
                                : "Analyze Resume"}
                        </button>

                        <p className="text-center text-xs text-neutral-600 mt-4">
                            Supported format: PDF
                        </p>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="max-w-2xl mx-auto mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="max-w-2xl mx-auto mt-10 space-y-6">

                        {/* ATS Score */}
                        <Card title="ATS Score">

                            <h2 className="text-5xl font-bold text-green-400">
                                {result.atsScore}/100
                            </h2>

                            <p className="text-neutral-300 mt-3">
                                {result.summary}
                            </p>

                        </Card>

                        {/* Skills */}
                        <Card title="Skills Detected">

                            <div className="flex flex-wrap gap-2">

                                {result.skills?.length > 0 ? (
                                    result.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#5EEAD4] text-sm border border-[#14B8A6]/30"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-neutral-500">
                                        No skills detected.
                                    </p>
                                )}

                            </div>

                        </Card>

                        {/* Strengths */}
                        <Card title="Strengths">

                            {result.strengths?.length > 0 ? (
                                <ul className="space-y-3">

                                    {result.strengths.map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="text-neutral-300"
                                            >
                                                <span className="mr-2">
                                                    ✅
                                                </span>

                                                {item}
                                            </li>
                                        )
                                    )}

                                </ul>
                            ) : (
                                <p className="text-neutral-500">
                                    No strengths detected.
                                </p>
                            )}

                        </Card>

                        {/* Weaknesses */}
                        <Card title="Weaknesses">

                            {result.weaknesses?.length > 0 ? (
                                <ul className="space-y-3">

                                    {result.weaknesses.map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="text-neutral-300"
                                            >
                                                <span className="mr-2">
                                                    ⚠️
                                                </span>

                                                {item}
                                            </li>
                                        )
                                    )}

                                </ul>
                            ) : (
                                <p className="text-neutral-500">
                                    No major weaknesses detected.
                                </p>
                            )}

                        </Card>

                        {/* Recommendations */}
                        <Card title="Recommendations">

                            {result.recommendations?.length > 0 ? (
                                <div className="space-y-4">

                                    {result.recommendations.map(
                                        (item, i) => (
                                            <div
                                                key={i}
                                                className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4"
                                            >

                                                <div className="flex items-start gap-3">

                                                    <span className="text-lg">
                                                        💡
                                                    </span>

                                                    <p className="text-neutral-300 flex-1">
                                                        {item}
                                                    </p>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        askNexora(item)
                                                    }
                                                    className="mt-3 ml-8 px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm text-neutral-200 transition"
                                                >
                                                    Ask Nexora
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>
                            ) : (
                                <p className="text-neutral-500">
                                    No recommendations available.
                                </p>
                            )}

                        </Card>

                    </div>
                )}

            </main>

        </div>
    );
}