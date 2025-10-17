export default function AiServicesPage() {
    return (
        <main className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">AI Services</h1>
            <p className="text-gray-600">Frontend placeholders for integration by backend team.</p>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4">
                    <div className="font-medium mb-2">Resume Screening</div>
                    <button className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Upload Resume</button>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="font-medium mb-2">AI Interview Bot</div>
                    <button className="px-3 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Start Interview</button>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="font-medium mb-2">Candidate Evaluation</div>
                    <button className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Evaluate</button>
                </div>
            </div>
        </main>
    )
}


