import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { Image as ImageIcon, Save, Send } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import CategoryDropdown from '../components/CategoryDropdown';

const CATEGORIES = [
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'pranayama', label: 'Pranayama' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'yoga-therapy', label: 'Yoga Therapy' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'ayurveda', label: 'Ayurveda' },
    { value: 'practice', label: 'Practice' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'philosophy', label: 'Philosophy' },
];

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'color', 'background'
];

const AddBlog = () => {
    const { addBlog, updateBlog, blogs } = useBlogs();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        authorTag: '',
        category: '',
        readTime: '',
        date: new Date().toISOString().split('T')[0],
        shortDescription: '',
        authorShortDescription: '',
        content: '',
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60',
        status: ''
    });

    useEffect(() => {
        if (isEditMode && blogs) {
            const blogToEdit = blogs.find(b => b.id === id);
            if (blogToEdit) {
                setFormData({
                    title: blogToEdit.title || '',
                    author: blogToEdit.author || '',
                    authorTag: blogToEdit.authorTag || '',
                    category: blogToEdit.category || '',
                    readTime: blogToEdit.readTime || '',
                    date: blogToEdit.date || new Date().toISOString().split('T')[0],
                    shortDescription: blogToEdit.shortDescription || '',
                    authorShortDescription: blogToEdit.authorShortDescription || '',
                    content: blogToEdit.content || '',
                    image: blogToEdit.image || '',
                    status: blogToEdit.status || ''
                });
            }
        }
    }, [id, isEditMode, blogs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleAction = (status) => {
        if (!formData.title || !formData.content) {
            alert('Please fill in required fields');
            return;
        }

        if (isEditMode) {
            updateBlog(id, { ...formData, status });
        } else {
            addBlog({ ...formData, status });
        }

        navigate(status === 'published' ? '/admin-panel/published' : '/admin-panel/drafts');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                            {isEditMode ? 'Edit Blog' : 'Create Blog'}
                        </h1>
                        {isEditMode && formData.status && (
                            <span className={`ag-badge ${formData.status === 'published' ? 'ag-badge-published' : 'ag-badge-draft'} mt-1`}>
                                {formData.status.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 mt-1">
                        {isEditMode ? 'Make changes to your masterpiece.' : 'Draft your next masterpiece.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="ag-card p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Please enter blog title"
                                className="ag-input text-base"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                <CategoryDropdown
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    options={CATEGORIES}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Read Time</label>
                                <input
                                    name="readTime"
                                    value={formData.readTime}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 min read"
                                    className="ag-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    onClick={(e) => e.target.showPicker()}
                                    className="ag-input custom-date-input"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
                                <div className="relative group">
                                    <input
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="Enter author name"
                                        className="ag-input pl-11"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Author Tag</label>
                                <div className="relative group">
                                    <input
                                        name="authorTag"
                                        value={formData.authorTag}
                                        onChange={handleChange}
                                        placeholder="e.g. Yoga Expert / Senior Editor"
                                        className="ag-input pl-11"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Author Short Description</label>
                            <div className="relative group">
                                <textarea
                                    name="authorShortDescription"
                                    value={formData.authorShortDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Brief bio of the author..."
                                    className="ag-input pl-11 resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                            <div className="relative group">
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter a brief summary of the blog..."
                                    className="ag-input pl-11 resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                            <div className="rich-text-editor">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    placeholder="Enter your content here..."
                                    modules={modules}
                                    formats={formats}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Please enter content for your blog</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="ag-card p-8 space-y-6">
                        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-4">Publishing</h3>

                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Featured Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div
                                onClick={triggerFileInput}
                                className="aspect-video w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative group cursor-pointer hover:border-primary/50 transition-all"
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon size={32} />
                                        <span className="mt-2 text-xs font-semibold">Upload Image</span>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            triggerFileInput();
                                        }}
                                        className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold shadow-lg cursor-pointer"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => handleAction('published')}
                                className="w-full ag-button flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 cursor-pointer"
                            >
                                <Send size={18} />
                                <span>{isEditMode ? 'Update Blog' : 'Publish Now'}</span>
                            </button>

                            <button
                                onClick={() => handleAction('draft')}
                                className="w-full ag-button-outline flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <Save size={18} />
                                <span>{isEditMode ? 'Save as Draft' : 'Save Draft'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBlog;
