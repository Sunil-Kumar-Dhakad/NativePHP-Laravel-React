import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Blog({ blogs = [] }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        author: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('blogs.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <>
            <Head title="Blog" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Blog</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? 'Cancel' : 'Create Blog'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Author</label>
                            <input
                                type="text"
                                value={data.author}
                                onChange={(e) => setData('author', e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {errors.author && <span className="text-red-500 text-sm">{errors.author}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Content</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows="5"
                                className="w-full px-3 py-2 border rounded"
                            />
                            {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                )}

                <div className="grid gap-6">
                    {blogs.length === 0 ? (
                        <p className="text-gray-500">No blogs found. Create one to get started!</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog.id} className="bg-white p-6 rounded shadow">
                                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                                <p className="text-gray-600 text-sm mb-3">By {blog.author}</p>
                                <p className="text-gray-700 mb-4">{blog.content.substring(0, 150)}...</p>
                                <Link
                                    href={route('blogs.show', blog.id)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Read More →
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}