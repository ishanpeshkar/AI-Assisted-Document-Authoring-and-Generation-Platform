import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { FileText, Presentation, Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await client.get('/projects/');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
                <Link
                    to="/new-project"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No projects</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new document.</p>
                    <div className="mt-6">
                        <Link
                            to="/new-project"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Project
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link to={`/editor/${project.id}`} key={project.id}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white overflow-hidden shadow rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 p-3 rounded-md ${project.type === 'docx' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {project.type === 'docx' ? <FileText className="h-6 w-6" /> : <Presentation className="h-6 w-6" />}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-slate-900 truncate" title={project.title}>
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 truncate" title={project.topic}>
                                                {project.topic}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200">
                                    <div className="text-xs text-slate-500 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
