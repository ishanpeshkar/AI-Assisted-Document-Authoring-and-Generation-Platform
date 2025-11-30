import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { FileText, Presentation, ArrowRight, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const NewProject = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'docx', // or 'pptx'
        topic: '',
        sections: []
    });

    // Helper to add a default section
    const addSection = () => {
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, { title: '', order: prev.sections.length + 1, content: '' }]
        }));
    };

    const removeSection = (index) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }))
        }));
    };

    const updateSection = (index, value) => {
        const newSections = [...formData.sections];
        newSections[index].title = value;
        setFormData({ ...formData, sections: newSections });
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const response = await client.post('/projects/', formData);
            navigate(`/editor/${response.data.id}`);
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
                <div className="mt-2 flex items-center text-sm text-slate-500">
                    <span className={`font-medium ${step >= 1 ? 'text-indigo-600' : ''}`}>1. Type & Topic</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className={`font-medium ${step >= 2 ? 'text-indigo-600' : ''}`}>2. Structure</span>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-8">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, type: 'docx' })}
                                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${formData.type === 'docx'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600 ring-opacity-50'
                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <FileText className="h-8 w-8 mb-2" />
                                        <span className="font-medium">Word Document</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, type: 'pptx' })}
                                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${formData.type === 'pptx'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600 ring-opacity-50'
                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Presentation className="h-8 w-8 mb-2" />
                                        <span className="font-medium">PowerPoint Presentation</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Project Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Q3 Market Analysis"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Main Topic / Prompt</label>
                                <textarea
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Describe what you want to generate..."
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        if (formData.sections.length === 0) addSection();
                                        setStep(2);
                                    }}
                                    disabled={!formData.title || !formData.topic}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next: Define Structure
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-slate-900">
                                    {formData.type === 'docx' ? 'Document Outline' : 'Presentation Slides'}
                                </h3>
                                <button
                                    onClick={addSection}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add {formData.type === 'docx' ? 'Section' : 'Slide'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.sections.map((section, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-slate-400 font-mono w-6 text-right">{index + 1}.</span>
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={formData.type === 'docx' ? "Section Header" : "Slide Title"}
                                            value={section.title}
                                            onChange={(e) => updateSection(index, e.target.value)}
                                        />
                                        <button
                                            onClick={() => removeSection(index)}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-slate-600 hover:text-slate-900 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading || formData.sections.length === 0 || formData.sections.some(s => !s.title)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default NewProject;
