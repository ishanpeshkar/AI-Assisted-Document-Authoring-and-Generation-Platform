import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { Save, Download, ArrowLeft, Send, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [refiningSectionId, setRefiningSectionId] = useState(null);
    const [refinementPrompt, setRefinementPrompt] = useState('');

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await client.get(`/projects/${id}`);
            setProject(response.data);
        } catch (error) {
            console.error('Failed to fetch project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateContent = async () => {
        setGenerating(true);
        try {
            await client.post('/generation/generate', { project_id: parseInt(id) });
            await fetchProject(); // Refresh to see content
        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleRefine = async (sectionId) => {
        if (!refinementPrompt.trim()) return;

        setRefiningSectionId(sectionId);
        try {
            await client.post('/generation/refine', {
                section_id: sectionId,
                instruction: refinementPrompt
            });
            setRefinementPrompt('');
            await fetchProject();
        } catch (error) {
            console.error('Failed to refine content:', error);
        } finally {
            setRefiningSectionId(null);
        }
    };

    const handleExport = async () => {
        try {
            const response = await client.get(`/export/${id}`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = project.type === 'docx' ? 'docx' : 'pptx';
            link.setAttribute('download', `${project.title}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to export:', error);
            alert('Failed to export document');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    const hasContent = project.sections.some(s => s.content);

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center">
                    <button onClick={() => navigate('/')} className="mr-4 text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
                        <p className="text-sm text-slate-500">{project.type === 'docx' ? 'Word Document' : 'PowerPoint Presentation'}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    {!hasContent && (
                        <button
                            onClick={handleGenerateContent}
                            disabled={generating}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                        >
                            {generating ? 'Generating AI Content...' : 'Generate Content'}
                        </button>
                    )}
                    {hasContent && (
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto bg-slate-100 p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {project.sections.map((section) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800">{section.title}</h3>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">
                                    {project.type === 'docx' ? 'Section' : 'Slide'} {section.order}
                                </span>
                            </div>

                            <div className="p-6">
                                {section.content ? (
                                    <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                ) : (
                                    <div className="text-slate-400 italic text-center py-8">
                                        Content pending generation...
                                    </div>
                                )}
                            </div>

                            {/* Refinement Interface */}
                            {section.content && (
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Ask AI to refine this section (e.g., 'Make it shorter', 'Add more details')..."
                                                    className="w-full pl-4 pr-12 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    value={refiningSectionId === section.id ? refinementPrompt : ''}
                                                    onChange={(e) => {
                                                        if (refiningSectionId !== section.id) {
                                                            setRefiningSectionId(section.id);
                                                            setRefinementPrompt(e.target.value);
                                                        } else {
                                                            setRefinementPrompt(e.target.value);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && refiningSectionId === section.id) {
                                                            handleRefine(section.id);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleRefine(section.id)}
                                                    disabled={refiningSectionId === section.id && !refinementPrompt}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 disabled:text-slate-400"
                                                >
                                                    <Send className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-green-600 rounded-full hover:bg-green-50">
                                                <ThumbsUp className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50">
                                                <ThumbsDown className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {refiningSectionId === section.id && generating && (
                                        <div className="mt-2 text-xs text-indigo-600 animate-pulse">Refining...</div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Editor;
