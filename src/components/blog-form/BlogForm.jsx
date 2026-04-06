import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useBlogs } from '../../context/BlogContext';
import BlogHeader from './BlogHeader';
import BlogEditor from './BlogEditor';
import AuthorDetails from './AuthorDetails';
import PublishingSettings from './PublishingSettings';
import BlogImageUpload from './BlogImageUpload';
import SEOTags from './SEOTags';
import BlogActions from './BlogActions';

const BlogForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { blogs, categories, addBlog, updateBlog, addCategory, deleteCategory } = useBlogs();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Published');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [authorRole, setAuthorRole] = useState('');
    const [readTime, setReadTime] = useState('');
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (id && blogs.length > 0) {
            const blogToEdit = blogs.find(b => String(b.id) === String(id));
            if (blogToEdit) {
                setTitle(blogToEdit.title || '');
                setContent(blogToEdit.content || '');
                setStatus(blogToEdit.status || 'Published');
                setCategory(blogToEdit.category || '');
                setAuthor(blogToEdit.author || '');
                setAuthorRole(blogToEdit.authorRole || '');
                setReadTime(blogToEdit.readTime || '');
                setImages(blogToEdit.images || []);
                setTags(blogToEdit.tags || []);
            }
        }
    }, [id, blogs]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const isFormValid =
        title.trim() !== '' &&
        content.trim() !== '' &&
        content !== '<p><br></p>' &&
        category !== '' &&
        author.trim() !== '' &&
        authorRole.trim() !== '' &&
        readTime.trim() !== '' &&
        images.length > 0;

    const handleSave = async (overridingStatus = null) => {
        if (!isFormValid) {
            toast.error('Please fill in all required fields and upload a cover image.');
            return;
        }
        
        const finalStatus = overridingStatus || status;
        const blogData = {
            title: title || 'Untitled Article',
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            content,
            status: finalStatus,
            category: category || 'Market Insights',
            author: author || 'Admin',
            authorRole: authorRole || 'Editor',
            readTime: readTime || '5 min read',
            images,
            tags,
            date: new Date().toISOString().split('T')[0],
        };

        try {
            if (id) {
                await updateBlog(id, blogData);
                toast.success('Article updated successfully!');
            } else {
                await addBlog(blogData);
                toast.success(`Article ${finalStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
            }
            navigate('/admin-panel/all-blogs');
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save article.");
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 animate-fade-in pb-12">
            <BlogHeader
                id={id}
                onCancel={() => navigate('/admin-panel/all-blogs')}
                windowWidth={windowWidth}
            />

            <div className="mx-auto space-y-8">
                <div className="space-y-6">
                    <BlogEditor
                        title={title}
                        handleTitleChange={handleTitleChange}
                        content={content}
                        setContent={setContent}
                        modules={modules}
                    />

                    <AuthorDetails
                        author={author}
                        setAuthor={setAuthor}
                        authorRole={authorRole}
                        setAuthorRole={setAuthorRole}
                        readTime={readTime}
                        setReadTime={setReadTime}
                    />
                </div>

                <PublishingSettings
                    category={category}
                    setCategory={setCategory}
                    status={status}
                    setStatus={setStatus}
                    categoryOptions={categories}
                    onAddCategory={addCategory}
                    onDeleteCategory={deleteCategory}
                />

                <BlogImageUpload
                    images={images}
                    onChange={(newImages) => setImages(newImages)}
                />

                <SEOTags
                    tags={tags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleAddTag={handleAddTag}
                    removeTag={removeTag}
                />

                <BlogActions
                    handleSave={handleSave}
                    isFormValid={isFormValid}
                />
            </div>
        </form>
    );
};

export default BlogForm;
