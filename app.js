/* ==========================================================================
   ANIKESH RAMIA PORTFOLIO & BLOG - CLIENT SIDE ENGINE (app.js)
   ========================================================================== */

// Default Configuration and Mock Data
const DEFAULT_PROFILE = {
    name: "Anikesh Ramia",
    school: "Emma C. Smith Elementary School, Livermore",
    grade: "5th Grade",
    bio: "I am an enthusiastic 5th grader who loves science, coding, playing sports, and exploring new ideas. Welcome to my achievements website where I document my learning journey, awards, and cool milestones!",
    avatar: "https://images.unsplash.com/photo-1596495578065-6e07cf507432?w=300&auto=format&fit=crop&q=80",
    passcode: "1234"
};

const DEFAULT_POSTS = [
    {
        id: "post_1",
        title: "1st Place in Livermore District Science Fair",
        category: "Science & Tech",
        date: "2026-04-12",
        summary: "Designed a clean energy solar tracker that improves panel efficiency by 25% using recycled materials.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        content: "I designed a solar tracking device that rotates towards the sun to capture the maximum amount of light. Using cardboard, a micro-servo motor, and light sensors, I built a prototype that adjusts its angle dynamically.\n\n### What I Did:\n- Programmed the control chip to measure light intensity on left and right sensors.\n- Calibrated the motor to move in small steps towards the brighter sensor.\n- Compared the voltage generated to a fixed solar panel over 3 hours.\n\n### The Results:\nMy solar tracker collected **25% more electricity** than the static solar panel. I was awarded first place in the Livermore Elementary Science Fair! It was so much fun presenting my project to the judges and explaining how it works."
    },
    {
        id: "post_2",
        title: "Scored Winning Goal in Tri-Valley Soccer Tournament",
        category: "Sports",
        date: "2026-05-20",
        summary: "Helped our school team, the Leopards, win the championship cup by scoring a goal in the final minutes.",
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
        content: "Our school soccer team, the Emma C. Smith Leopards, played in the Tri-Valley Junior Cup. It was a tough tournament with competitive teams from all around the Livermore district.\n\nIn the final match against the Falcons, we were tied 1-1 with only three minutes left on the clock. My teammate passed me the ball near the penalty box, and I was able to kick it past the goalkeeper into the top corner of the net!\n\nWe won the game 2-1 and took home the championship trophy. I learned that teamwork, passing, and practicing our drills after school really pays off. I can't wait for the next season!"
    },
    {
        id: "post_3",
        title: "Learned JavaScript and Built a Mini-Game",
        category: "Science & Tech",
        date: "2026-06-15",
        summary: "Successfully coded a classic Brick Breaker game from scratch using canvas and event listeners.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
        content: "This summer, I challenged myself to learn real coding instead of block programming. I decided to make a Brick Breaker game that runs in any web browser.\n\n### Technical Milestones:\n1. Created a drawing loop using `requestAnimationFrame` to animate the ball.\n2. Implemented keyboard controls to slide the paddle left and right.\n3. Wrote collision detection logic to bounce the ball off the walls, paddle, and bricks.\n4. Added a score tracker that counts how many bricks are destroyed.\n\nIt took me three days to fix a bug where the ball would stick to the paddle, but I figured it out by checking the coordinate boundaries. I'm really proud of how it turned out, and my friends loved playing it!"
    },
    {
        id: "post_4",
        title: "Emma C. Smith Elementary Principal's Honor Roll",
        category: "Academics",
        date: "2026-06-25",
        summary: "Received straight As in all subjects, including Advanced Math and Science, for the entire school year.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
        content: "At the end of the school year assembly, I was very excited to receive the Principal's Honor Roll certificate from our principal. This award is given to students who maintain a straight-A average throughout all four quarters of school.\n\nMy favorite subjects this year were Mathematics and English Writing. I worked hard to complete all my homework on time and study for our weekly spelling and math quizzes. I want to say a big thank you to my teacher and my parents for helping me grow!"
    }
];

// Local State variables
let state = {
    profile: { ...DEFAULT_PROFILE },
    posts: [ ...DEFAULT_POSTS ],
    isAdminUnlocked: false
};

// Local storage key
const STORAGE_KEY = "anikesh_site_state";

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupNavigation();
    setupTheme();
    setupAdmin();
    setupToolbar();
    setupForms();
    setupSearchFilter();
    renderPageContent();
});

// Load state from localStorage or initialize with defaults
function loadState() {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            // Sync missing keys if state structure changed
            if (!state.profile) state.profile = { ...DEFAULT_PROFILE };
            if (!state.posts) state.posts = [ ...DEFAULT_POSTS ];
            state.isAdminUnlocked = false; // Always lock admin mode on reload
        } catch (e) {
            console.error("Error parsing saved state, resetting...", e);
            saveState();
        }
    } else {
        saveState();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Navigation / Tabs System
function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link:not(.admin-btn)");
    const adminNavLink = document.getElementById("adminNavLink");
    const heroAdminBtn = document.getElementById("heroAdminBtn");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute("data-target");
            switchTab(targetTab);
        });
    });

    adminNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("admin-section");
    });

    heroAdminBtn.addEventListener("click", () => {
        switchTab("admin-section");
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinksContainer = document.getElementById("navLinks");
    
    mobileMenuToggle.addEventListener("click", () => {
        navLinksContainer.classList.toggle("active");
        const icon = mobileMenuToggle.querySelector("i");
        if (navLinksContainer.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close mobile menu when clicking a link
    const allLinks = document.querySelectorAll(".nav-link");
    allLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinksContainer.classList.remove("active");
            mobileMenuToggle.querySelector("i").className = "fa-solid fa-bars";
        });
    });
}

function switchTab(targetTabId) {
    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });

    // Show target tab
    const targetTab = document.getElementById(targetTabId);
    if (targetTab) {
        targetTab.classList.add("active");
    }

    // Update nav links active status
    const allLinks = document.querySelectorAll(".nav-link");
    allLinks.forEach(link => {
        link.classList.remove("active");
        const linkTarget = link.getAttribute("data-target");
        if (linkTarget === targetTabId) {
            link.classList.add("active");
        }
    });

    // Handle dashboard sidebar state if switching to admin
    if (targetTabId === "admin-section") {
        if (state.isAdminUnlocked) {
            showAdminPanel("panelNewPost");
            document.getElementById("menuBtnNewPost").classList.add("active");
        } else {
            document.getElementById("adminPinInput").value = "";
            document.getElementById("lockErrorMsg").classList.add("hide");
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Dark/Light Theme System
function setupTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.className = "dark-mode";
        themeToggle.querySelector("i").className = "fa-solid fa-sun";
    } else {
        body.className = "light-mode";
        themeToggle.querySelector("i").className = "fa-solid fa-moon";
    }

    themeToggle.addEventListener("click", () => {
        if (body.classList.contains("light-mode")) {
            body.className = "dark-mode";
            localStorage.setItem("theme", "dark");
            themeToggle.querySelector("i").className = "fa-solid fa-sun";
            showToast("Dark Mode Enabled", "info");
        } else {
            body.className = "light-mode";
            localStorage.setItem("theme", "light");
            themeToggle.querySelector("i").className = "fa-solid fa-moon";
            showToast("Light Mode Enabled", "info");
        }
    });
}

// Toast Notifications
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;
    
    // Reset toast classes
    toast.className = "toast";
    
    if (type === "error") {
        toast.classList.add("error");
        toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    } else if (type === "info") {
        toast.classList.add("info");
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
    } else {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }

    // Trigger animation
    toast.classList.add("show");

    // Hide after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// Admin Lock/Unlock System
function setupAdmin() {
    const adminUnlockBtn = document.getElementById("adminUnlockBtn");
    const adminPinInput = document.getElementById("adminPinInput");
    const adminLockScreen = document.getElementById("adminLockScreen");
    const adminWorkspace = document.getElementById("adminWorkspace");
    const lockErrorMsg = document.getElementById("lockErrorMsg");
    const adminLockBtn = document.getElementById("adminLockBtn");
    const exitEditModeBtn = document.getElementById("exitEditModeBtn");

    const unlockDashboard = () => {
        const enteredPin = adminPinInput.value;
        const correctPin = state.profile.passcode || DEFAULT_PROFILE.passcode;

        if (enteredPin === correctPin) {
            state.isAdminUnlocked = true;
            adminLockScreen.classList.add("hide");
            adminWorkspace.classList.remove("hide");
            document.getElementById("editModeIndicator").classList.remove("hide");
            showToast("Creator Dashboard Unlocked!");
            renderPageContent(); // Re-render achievements with edit buttons
            showAdminPanel("panelNewPost");
        } else {
            lockErrorMsg.classList.remove("hide");
            showToast("Incorrect passcode", "error");
        }
    };

    adminUnlockBtn.addEventListener("click", unlockDashboard);
    adminPinInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") unlockDashboard();
    });

    const lockDashboard = () => {
        state.isAdminUnlocked = false;
        adminLockScreen.classList.remove("hide");
        adminWorkspace.classList.add("hide");
        document.getElementById("editModeIndicator").classList.add("hide");
        adminPinInput.value = "";
        showToast("Dashboard Locked.", "info");
        renderPageContent(); // Re-render achievements without edit buttons
    };

    adminLockBtn.addEventListener("click", lockDashboard);
    exitEditModeBtn.addEventListener("click", lockDashboard);

    // Sidebar panel selectors switching
    const sidebarButtons = document.querySelectorAll(".sidebar-menu-btn");
    sidebarButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sidebarButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const panelMap = {
                "menuBtnNewPost": "panelNewPost",
                "menuBtnProfile": "panelProfile",
                "menuBtnBackup": "panelBackup"
            };
            
            showAdminPanel(panelMap[btn.id]);
        });
    });
}

function showAdminPanel(panelId) {
    document.querySelectorAll(".admin-panel-content").forEach(panel => {
        panel.classList.remove("active");
    });
    const target = document.getElementById(panelId);
    if (target) target.classList.add("active");
    
    // Sync settings in forms when switching
    if (panelId === "panelProfile") {
        populateProfileForm();
    }
}

// Markdown Preview Setup
function setupToolbar() {
    const editorPreviewToggle = document.getElementById("editorPreviewToggle");
    const postContentTextarea = document.getElementById("postContent");
    const postContentPreview = document.getElementById("postContentPreview");

    editorPreviewToggle.addEventListener("click", () => {
        if (postContentPreview.classList.contains("hide")) {
            // Switch to Preview
            const markdownText = postContentTextarea.value;
            postContentPreview.innerHTML = parseMarkdown(markdownText);
            postContentTextarea.classList.add("hide");
            postContentPreview.classList.remove("hide");
            editorPreviewToggle.innerHTML = '<i class="fa-solid fa-pen"></i> Write Mode';
            editorPreviewToggle.classList.add("active");
        } else {
            // Switch to Write
            postContentTextarea.classList.remove("hide");
            postContentPreview.classList.add("hide");
            editorPreviewToggle.innerHTML = '<i class="fa-solid fa-eye"></i> Preview Mode';
            editorPreviewToggle.classList.remove("active");
        }
    });
}

// Markdown text helper functions
window.insertFormat = function(startTag, endTag) {
    const textarea = document.getElementById("postContent");
    const text = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = text.substring(start, end);
    const replacement = startTag + selectedText + endTag;

    textarea.value = text.substring(0, start) + replacement + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
};

// Form Elements Logic & Data Manipulation
function setupForms() {
    const achievementForm = document.getElementById("achievementForm");
    const profileForm = document.getElementById("profileForm");
    const categorySelect = document.getElementById("postCategory");
    const customCategoryInput = document.getElementById("customCategoryInput");
    
    // Category dropdown change logic
    categorySelect.addEventListener("change", () => {
        if (categorySelect.value === "Custom") {
            customCategoryInput.classList.remove("hide");
            customCategoryInput.required = true;
        } else {
            customCategoryInput.classList.add("hide");
            customCategoryInput.required = false;
        }
    });

    // Image Upload helper functions (Post Creator)
    const uploadImageBtn = document.getElementById("uploadImageBtn");
    const postImageFile = document.getElementById("postImageFile");
    const formImagePreviewContainer = document.getElementById("formImagePreviewContainer");
    const formImagePreview = document.getElementById("formImagePreview");
    const removeFormImageBtn = document.getElementById("removeFormImageBtn");
    const postImageUrlInput = document.getElementById("postImageUrl");

    uploadImageBtn.addEventListener("click", () => {
        postImageFile.click();
    });

    // Convert file to Base64 data url
    postImageFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit
            showToast("File size too large. Limit is 1MB.", "error");
            postImageFile.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            formImagePreview.src = event.target.result;
            formImagePreviewContainer.classList.remove("hide");
            postImageUrlInput.value = ""; // Clear URL input if file is uploaded
            showToast("Image file uploaded successfully!");
        };
        reader.readAsDataURL(file);
    });

    // Synchronize direct image URL pasting preview
    postImageUrlInput.addEventListener("input", () => {
        const url = postImageUrlInput.value.trim();
        if (url) {
            formImagePreview.src = url;
            formImagePreviewContainer.classList.remove("hide");
            postImageFile.value = ""; // Clear file uploaded
        } else {
            formImagePreviewContainer.classList.add("hide");
        }
    });

    removeFormImageBtn.addEventListener("click", () => {
        postImageFile.value = "";
        postImageUrlInput.value = "";
        formImagePreview.src = "";
        formImagePreviewContainer.classList.add("hide");
        showToast("Image removed", "info");
    });

    // Image Upload helper functions (Profile Creator)
    const uploadAvatarBtn = document.getElementById("uploadAvatarBtn");
    const editProfileAvatarFile = document.getElementById("editProfileAvatarFile");
    const editProfileAvatar = document.getElementById("editProfileAvatar");

    uploadAvatarBtn.addEventListener("click", () => {
        editProfileAvatarFile.click();
    });

    editProfileAvatarFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            showToast("File size too large. Limit is 1MB.", "error");
            editProfileAvatarFile.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            editProfileAvatar.value = event.target.result;
            showToast("Profile image loaded!");
        };
        reader.readAsDataURL(file);
    });

    // Reset Forms
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const resetFormBtn = document.getElementById("resetFormBtn");
    
    resetFormBtn.addEventListener("click", () => {
        formImagePreviewContainer.classList.add("hide");
        formImagePreview.src = "";
        customCategoryInput.classList.add("hide");
        customCategoryInput.required = false;
        
        // Reset preview state
        document.getElementById("postContent").classList.remove("hide");
        document.getElementById("postContentPreview").classList.add("hide");
        document.getElementById("editorPreviewToggle").innerHTML = '<i class="fa-solid fa-eye"></i> Preview Mode';
        document.getElementById("editorPreviewToggle").classList.remove("active");
    });

    cancelEditBtn.addEventListener("click", () => {
        resetAchievementForm();
    });

    // SAVE/CREATE POST SUBMIT
    achievementForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveAchievement();
    });

    // SAVE PROFILE SUBMIT
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveProfile();
    });

    // BACKUP & RESTORE TRIGGERS
    document.getElementById("exportDataBtn").addEventListener("click", exportData);
    document.getElementById("triggerImportBtn").addEventListener("click", () => {
        document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", importData);
    
    // Modal Close
    document.getElementById("closeModalBtn").addEventListener("click", closeModal);
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("achievementModal");
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Reset achievement editor form values back to blank state
function resetAchievementForm() {
    const form = document.getElementById("achievementForm");
    form.reset();
    document.getElementById("editPostId").value = "";
    document.getElementById("formTitle").textContent = "Create New Achievement Post";
    document.getElementById("savePostBtn").innerHTML = '<i class="fa-solid fa-save"></i> Publish Achievement';
    document.getElementById("cancelEditBtn").classList.add("hide");
    document.getElementById("formImagePreviewContainer").classList.add("hide");
    document.getElementById("formImagePreview").src = "";
    document.getElementById("customCategoryInput").classList.add("hide");
    document.getElementById("customCategoryInput").required = false;
    
    // Switch write/preview back
    document.getElementById("postContent").classList.remove("hide");
    document.getElementById("postContentPreview").classList.add("hide");
    document.getElementById("editorPreviewToggle").innerHTML = '<i class="fa-solid fa-eye"></i> Preview Mode';
    document.getElementById("editorPreviewToggle").classList.remove("active");
}

// Add or edit/update achievement object
function saveAchievement() {
    const id = document.getElementById("editPostId").value;
    const title = document.getElementById("postTitle").value.trim();
    const date = document.getElementById("postDate").value;
    const summary = document.getElementById("postSummary").value.trim();
    const content = document.getElementById("postContent").value.trim();
    
    // Category check
    let category = document.getElementById("postCategory").value;
    if (category === "Custom") {
        category = document.getElementById("customCategoryInput").value.trim();
        if (!category) {
            showToast("Please enter a custom category name", "error");
            return;
        }
    }

    // Image check
    let image = "";
    const previewSrc = document.getElementById("formImagePreview").src;
    if (previewSrc && !previewSrc.endsWith("/")) {
        image = previewSrc;
    } else {
        image = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80"; // Default generic learning image
    }

    if (id) {
        // Edit existing post
        const index = state.posts.findIndex(p => p.id === id);
        if (index !== -1) {
            state.posts[index] = { id, title, category, date, summary, image, content };
            showToast("Achievement post updated and refined!");
        } else {
            showToast("Error updating post", "error");
            return;
        }
    } else {
        // Create new post
        const newId = "post_" + Date.now();
        state.posts.unshift({ id: newId, title, category, date, summary, image, content });
        showToast("New achievement posted successfully!");
    }

    saveState();
    resetAchievementForm();
    renderPageContent();
    
    // Redirect to achievements tab to review it
    switchTab("achievements-section");
}

// Edit Existing Post (called from card buttons)
window.editPost = function(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) {
        showToast("Post not found", "error");
        return;
    }

    // switch to dashboard workspace panel
    switchTab("admin-section");
    showAdminPanel("panelNewPost");
    document.querySelectorAll(".sidebar-menu-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("menuBtnNewPost").classList.add("active");

    // Populate values
    document.getElementById("editPostId").value = post.id;
    document.getElementById("formTitle").textContent = "Refine / Edit Achievement Post";
    document.getElementById("savePostBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save & Refine Post';
    document.getElementById("cancelEditBtn").classList.remove("hide");

    document.getElementById("postTitle").value = post.title;
    document.getElementById("postDate").value = post.date;
    document.getElementById("postSummary").value = post.summary;
    document.getElementById("postContent").value = post.content;

    // Category population
    const catSelect = document.getElementById("postCategory");
    const customCatInput = document.getElementById("customCategoryInput");
    
    if (["Academics", "Science & Tech", "Sports", "Arts & Hobbies"].includes(post.category)) {
        catSelect.value = post.category;
        customCatInput.classList.add("hide");
        customCatInput.required = false;
    } else {
        catSelect.value = "Custom";
        customCatInput.value = post.category;
        customCatInput.classList.remove("hide");
        customCatInput.required = true;
    }

    // Image preview population
    const imgPreview = document.getElementById("formImagePreview");
    const imgContainer = document.getElementById("formImagePreviewContainer");
    
    if (post.image) {
        imgPreview.src = post.image;
        imgContainer.classList.remove("hide");
        if (post.image.startsWith("data:")) {
            document.getElementById("postImageUrl").value = "";
        } else {
            document.getElementById("postImageUrl").value = post.image;
        }
    } else {
        imgPreview.src = "";
        imgContainer.classList.add("hide");
    }
};

// Delete Existing Post
window.deletePost = function(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    const confirmDelete = confirm(`Are you sure you want to permanently delete "${post.title}"?`);
    if (confirmDelete) {
        state.posts = state.posts.filter(p => p.id !== id);
        saveState();
        showToast("Achievement deleted successfully.", "info");
        renderPageContent();
        
        // If we are currently editing this post, reset form
        if (document.getElementById("editPostId").value === id) {
            resetAchievementForm();
        }
    }
};

// Profile settings populate & save
function populateProfileForm() {
    document.getElementById("editProfileName").value = state.profile.name || "";
    document.getElementById("editProfileGrade").value = state.profile.grade || "";
    document.getElementById("editProfileSchool").value = state.profile.school || "";
    document.getElementById("editProfileAvatar").value = state.profile.avatar.startsWith("data:") ? "" : state.profile.avatar;
    document.getElementById("editProfileBio").value = state.profile.bio || "";
    document.getElementById("editPasscode").value = ""; // Don't show passcode, keep empty to keep unchanged
}

function saveProfile() {
    const name = document.getElementById("editProfileName").value.trim();
    const grade = document.getElementById("editProfileGrade").value.trim();
    const school = document.getElementById("editProfileSchool").value.trim();
    const avatarInput = document.getElementById("editProfileAvatar").value.trim();
    const bio = document.getElementById("editProfileBio").value.trim();
    const newPasscode = document.getElementById("editPasscode").value.trim();

    state.profile.name = name;
    state.profile.grade = grade;
    state.profile.school = school;
    state.profile.bio = bio;
    
    if (avatarInput) {
        state.profile.avatar = avatarInput;
    }
    
    if (newPasscode) {
        if (!/^\d+$/.test(newPasscode)) {
            showToast("Passcode must contain only digits", "error");
            return;
        }
        state.profile.passcode = newPasscode;
        showToast("Dashboard passcode updated successfully!");
    }

    saveState();
    renderPageContent();
    showToast("Profile configurations updated!");
    switchTab("home-section");
}

document.getElementById("resetProfileFormBtn").addEventListener("click", () => {
    populateProfileForm();
    showToast("Profile form reset", "info");
});

// JSON Backup Utilities
function exportData() {
    const dataStr = JSON.stringify(state, null, 4);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'achievements_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("Backup file downloaded!");
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsedData = JSON.parse(event.target.result);
            if (parsedData.profile && parsedData.posts) {
                state.profile = parsedData.profile;
                state.posts = parsedData.posts;
                saveState();
                renderPageContent();
                showToast("All data successfully restored!");
                
                // Reset file input value so same file can be uploaded again
                document.getElementById("importFile").value = "";
            } else {
                showToast("Invalid file structure. Restore failed.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Failed to parse file. Verify JSON format.", "error");
        }
    };
    reader.readAsText(file);
}

// Search and Category Filter engine
let currentFilterCategory = "all";
let currentSearchQuery = "";

function setupSearchFilter() {
    const searchInput = document.getElementById("achievementSearch");
    const clearBtn = document.getElementById("searchClearBtn");
    
    searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        if (currentSearchQuery) {
            clearBtn.classList.remove("hide");
        } else {
            clearBtn.classList.add("hide");
        }
        filterAchievements();
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        clearBtn.classList.add("hide");
        filterAchievements();
    });
}

function renderCategoryChips() {
    const filterContainer = document.getElementById("filterContainer");
    
    // Get unique categories from posts
    const categories = new Set();
    state.posts.forEach(post => {
        if (post.category) categories.add(post.category);
    });

    // Save default list of chips
    let html = `<button class="filter-chip ${currentFilterCategory === 'all' ? 'active' : ''}" data-category="all">All</button>`;
    
    categories.forEach(cat => {
        html += `<button class="filter-chip ${currentFilterCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>`;
    });

    filterContainer.innerHTML = html;

    // Add listeners to chips
    const chips = filterContainer.querySelectorAll(".filter-chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentFilterCategory = chip.getAttribute("data-category");
            filterAchievements();
        });
    });
}

function filterAchievements() {
    const grid = document.getElementById("achievementsGrid");
    const emptyState = document.getElementById("emptyState");
    const cards = grid.querySelectorAll(".achievement-card");
    
    let visibleCount = 0;

    cards.forEach(card => {
        const id = card.getAttribute("data-id");
        const post = state.posts.find(p => p.id === id);
        if (!post) return;

        const matchesCategory = currentFilterCategory === "all" || post.category === currentFilterCategory;
        const matchesSearch = !currentSearchQuery || 
                              post.title.toLowerCase().includes(currentSearchQuery) || 
                              post.summary.toLowerCase().includes(currentSearchQuery) || 
                              post.content.toLowerCase().includes(currentSearchQuery) ||
                              post.category.toLowerCase().includes(currentSearchQuery);

        if (matchesCategory && matchesSearch) {
            card.classList.remove("hide");
            visibleCount++;
        } else {
            card.classList.add("hide");
        }
    });

    if (visibleCount === 0) {
        grid.classList.add("hide");
        emptyState.classList.remove("hide");
    } else {
        grid.classList.remove("hide");
        emptyState.classList.add("hide");
    }
}

// Main page rendering orchestrator
function renderPageContent() {
    // 1. Sync Profile texts
    document.getElementById("profileName").textContent = state.profile.name;
    document.getElementById("profileSchool").textContent = state.profile.school;
    document.getElementById("profileBio").textContent = state.profile.bio;
    document.getElementById("profileAvatar").src = state.profile.avatar || DEFAULT_PROFILE.avatar;
    document.getElementById("profileGradeBadge").textContent = state.profile.grade || "5th Grade";
    
    // Quick Sidebar Profile sync
    const statsCount = document.getElementById("statCount");
    const statsCategories = document.getElementById("statCategories");
    const statsUpdated = document.getElementById("statUpdated");

    // Recalculate stats
    const totalPosts = state.posts.length;
    const categoriesSet = new Set(state.posts.map(p => p.category));
    
    statsCount.textContent = totalPosts;
    statsCategories.textContent = categoriesSet.size;
    
    if (totalPosts > 0) {
        // Find most recent post date
        const sortedDates = [...state.posts].map(p => p.date).sort((a,b) => new Date(b) - new Date(a));
        const lastDate = new Date(sortedDates[0]);
        statsUpdated.textContent = lastDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    } else {
        statsUpdated.textContent = "Never";
    }

    // Dashboard count sync
    document.getElementById("summaryTotalPosts").textContent = totalPosts;
    document.getElementById("summaryCategories").textContent = categoriesSet.size;

    // 2. Render Featured (first 3 posts)
    renderFeaturedGrid();

    // 3. Render Achievements Tab Grid
    renderAchievementsGrid();

    // 4. Render category chips based on existing posts
    renderCategoryChips();
}

function renderFeaturedGrid() {
    const featuredGrid = document.getElementById("featuredGrid");
    
    if (state.posts.length === 0) {
        featuredGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; padding: 2rem;">
                <p>No achievements documented yet. Unlock the dashboard to create posts!</p>
            </div>
        `;
        return;
    }

    // Sort achievements by date descending
    const sortedPosts = [...state.posts].sort((a,b) => new Date(b.date) - new Date(a.date));
    const topPosts = sortedPosts.slice(0, 3); // Take top 3

    let html = "";
    topPosts.forEach(post => {
        html += createCardHtml(post, false); // No admin buttons on featured section
    });

    featuredGrid.innerHTML = html;
}

function renderAchievementsGrid() {
    const grid = document.getElementById("achievementsGrid");
    const emptyState = document.getElementById("emptyState");

    if (state.posts.length === 0) {
        grid.innerHTML = "";
        grid.classList.add("hide");
        emptyState.classList.remove("hide");
        return;
    }

    grid.classList.remove("hide");
    emptyState.classList.add("hide");

    // Sort achievements by date descending
    const sortedPosts = [...state.posts].sort((a,b) => new Date(b.date) - new Date(a.date));

    let html = "";
    sortedPosts.forEach(post => {
        html += createCardHtml(post, state.isAdminUnlocked);
    });

    grid.innerHTML = html;
    
    // Initial category filter trigger
    filterAchievements();
}

// Generate single card item HTML
function createCardHtml(post, showAdminActions) {
    const displayDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let adminActionsHtml = "";
    if (showAdminActions) {
        adminActionsHtml = `
            <div class="card-admin-actions">
                <button class="action-btn edit" onclick="editPost('${post.id}')" title="Edit Post"><i class="fa-solid fa-pencil"></i></button>
                <button class="action-btn delete" onclick="deletePost('${post.id}')" title="Delete Post"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    }

    return `
        <article class="achievement-card" data-id="${post.id}">
            ${adminActionsHtml}
            <div class="card-img-wrapper" onclick="openPostModal('${post.id}')" style="cursor: pointer;">
                <img class="card-img" src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="badge badge-primary card-category-badge">${post.category}</span>
            </div>
            
            <div class="card-content">
                <span class="card-date"><i class="fa-regular fa-calendar"></i> ${displayDate}</span>
                <h3 class="card-title" onclick="openPostModal('${post.id}')">${post.title}</h3>
                <p class="card-summary">${post.summary}</p>
                
                <div class="card-footer">
                    <span class="read-more-btn" onclick="openPostModal('${post.id}')">Read Full Story <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
        </article>
    `;
}

// Achievement View Details Modal System
window.openPostModal = function(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    const modal = document.getElementById("achievementModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const modalDate = document.getElementById("modalDate");
    const modalImage = document.getElementById("modalImage");
    const modalContent = document.getElementById("modalContent");
    const modalFooterActions = document.getElementById("modalFooterActions");

    modalTitle.textContent = post.title;
    modalCategory.textContent = post.category;
    
    // Set proper category badge color class
    modalCategory.className = "badge badge-primary";
    
    const displayDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    modalDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${displayDate}`;
    
    if (post.image) {
        modalImage.src = post.image;
        modalImage.parentElement.classList.remove("hide");
    } else {
        modalImage.parentElement.classList.add("hide");
    }

    // Convert markdown notation in the story content
    modalContent.innerHTML = parseMarkdown(post.content);

    // If logged in, add an edit button to footer too!
    let footerHtml = "";
    if (state.isAdminUnlocked) {
        footerHtml = `
            <button class="btn btn-outline btn-sm text-indigo" onclick="closeModal(); editPost('${post.id}')">
                <i class="fa-solid fa-pencil"></i> Edit & Refine
            </button>
            <button class="btn btn-outline btn-sm text-red" onclick="closeModal(); deletePost('${post.id}')">
                <i class="fa-solid fa-trash-can"></i> Delete
            </button>
        `;
    }
    footerHtml += `<button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>`;
    modalFooterActions.innerHTML = footerHtml;

    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
};

window.closeModal = function() {
    const modal = document.getElementById("achievementModal");
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable background scrolling
};

// Simple custom line-by-line Markdown parsing implementation
function parseMarkdown(text) {
    if (!text) return '';
    let lines = text.split('\n');
    let html = [];
    let inList = false;
    let listType = null; // 'ul' or 'ol'

    function closeList() {
        if (inList) {
            html.push(`</${listType}>`);
            inList = false;
            listType = null;
        }
    }

    for (let line of lines) {
        let trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('### ')) {
            closeList();
            html.push(`<h3>${parseInline(trimmed.substring(4))}</h3>`);
        } else if (trimmed.startsWith('## ')) {
            closeList();
            html.push(`<h2>${parseInline(trimmed.substring(3))}</h2>`);
        } else if (trimmed.startsWith('# ')) {
            closeList();
            html.push(`<h1>${parseInline(trimmed.substring(2))}</h1>`);
        } 
        // Bullet list
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (!inList || listType !== 'ul') {
                closeList();
                html.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            html.push(`<li>${parseInline(trimmed.substring(2))}</li>`);
        } 
        // Numbered list
        else if (/^\d+\.\s+/.test(trimmed)) {
            let match = trimmed.match(/^\d+\.\s+/);
            if (!inList || listType !== 'ol') {
                closeList();
                html.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            html.push(`<li>${parseInline(trimmed.substring(match[0].length))}</li>`);
        } 
        // Empty line
        else if (trimmed === '') {
            closeList();
        } 
        // Normal paragraph
        else {
            closeList();
            html.push(`<p>${parseInline(trimmed)}</p>`);
        }
    }
    closeList();

    return html.join('\n');
}

function parseInline(text) {
    let result = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    // Bold **text**
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Links [text](url)
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    return result;
}
