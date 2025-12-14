(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const MASTER_PASSWORD = "admin123";
const USER_STORAGE_KEY = "rtf_user";
const LOGIN_LOGS_KEY = "rtf_login_logs";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sessionExpiry, setSessionExpiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const checkSessionExpiry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[checkSessionExpiry]": ()=>{
            if (user && sessionExpiry && new Date() > sessionExpiry) {
                setUser(null);
                setSessionExpiry(null);
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.removeItem(USER_STORAGE_KEY);
                }
                return false;
            }
            return true;
        }
    }["AuthProvider.useCallback[checkSessionExpiry]"], [
        user,
        sessionExpiry
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = localStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                try {
                    const userData = JSON.parse(stored);
                    // Restore login time as Date object
                    userData.loginTime = new Date(userData.loginTime);
                    const expiry = new Date(userData.loginTime.getTime() + SESSION_DURATION_MS);
                    if (new Date() > expiry) {
                        localStorage.removeItem(USER_STORAGE_KEY);
                    } else {
                        setUser(userData);
                        setSessionExpiry(expiry);
                    }
                } catch  {
                    localStorage.removeItem(USER_STORAGE_KEY);
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!user) return;
            const interval = setInterval({
                "AuthProvider.useEffect.interval": ()=>{
                    checkSessionExpiry();
                }
            }["AuthProvider.useEffect.interval"], 60000) // Check every minute
            ;
            return ({
                "AuthProvider.useEffect": ()=>clearInterval(interval)
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        user,
        checkSessionExpiry
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": (username, password, thanaDetails)=>{
            // Development: Accept any thana selection with master password
            if (password === MASTER_PASSWORD && username) {
                const loginTime = new Date();
                const userData = {
                    username: username,
                    role: "Police Station Officer",
                    loginTime,
                    thanaDetails: thanaDetails
                };
                setUser(userData);
                setSessionExpiry(new Date(loginTime.getTime() + SESSION_DURATION_MS));
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
                    const loginLog = {
                        timestamp: new Date().toISOString(),
                        thana: username,
                        division: thanaDetails?.division || "",
                        district: thanaDetails?.district || "",
                        success: true
                    };
                    try {
                        const existingLogs = JSON.parse(localStorage.getItem(LOGIN_LOGS_KEY) || "[]");
                        existingLogs.push(loginLog);
                        localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(existingLogs.slice(-100))); // Keep last 100 logs
                    } catch  {
                        localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify([
                            loginLog
                        ]));
                    }
                }
                return true;
            }
            return false;
        }
    }["AuthProvider.useCallback[login]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            setUser(null);
            setSessionExpiry(null);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem("rtf_sessions");
            }
        }
    }["AuthProvider.useCallback[logout]"], []);
    const refreshSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshSession]": ()=>{
            if (user) {
                const newLoginTime = new Date();
                const updatedUser = {
                    ...user,
                    loginTime: newLoginTime
                };
                setUser(updatedUser);
                setSessionExpiry(new Date(newLoginTime.getTime() + SESSION_DURATION_MS));
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                }
            }
        }
    }["AuthProvider.useCallback[refreshSession]"], [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading,
            refreshSession,
            sessionExpiry
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "G9D/Ae9CmhU86hOHgTALOJ1i/uo=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/data-store.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataStoreProvider",
    ()=>DataStoreProvider,
    "useDataStore",
    ()=>useDataStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DataStoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_KEY = "rtf_analysis_sessions";
function DataStoreProvider({ children }) {
    _s();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeSessionId, setActiveSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataStoreProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        // Restore dates as Date objects
                        const restored = parsed.map({
                            "DataStoreProvider.useEffect.restored": (s)=>({
                                    ...s,
                                    uploadedAt: new Date(s.uploadedAt)
                                })
                        }["DataStoreProvider.useEffect.restored"]);
                        setSessions(restored);
                    }
                } catch (error) {
                    console.error("Failed to restore sessions:", error);
                    localStorage.removeItem(STORAGE_KEY);
                }
                setIsInitialized(true);
            }
        }
    }["DataStoreProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataStoreProvider.useEffect": ()=>{
            if (isInitialized && ("TURBOPACK compile-time value", "object") !== "undefined") {
                try {
                    // Only store essential data to avoid localStorage limits
                    const toStore = sessions.map({
                        "DataStoreProvider.useEffect.toStore": (s)=>({
                                id: s.id,
                                module: s.module,
                                fileName: s.fileName,
                                uploadedAt: s.uploadedAt.toISOString(),
                                data: {
                                    headers: s.data.headers,
                                    rows: s.data.rows.slice(0, 100),
                                    analytics: s.data.analytics,
                                    metadata: s.data.metadata
                                }
                            })
                    }["DataStoreProvider.useEffect.toStore"]);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
                } catch (error) {
                    console.error("Failed to persist sessions:", error);
                }
            }
        }
    }["DataStoreProvider.useEffect"], [
        sessions,
        isInitialized
    ]);
    const addSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[addSession]": (module, fileName, data)=>{
            const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newSession = {
                id,
                module,
                fileName,
                uploadedAt: new Date(),
                data
            };
            setSessions({
                "DataStoreProvider.useCallback[addSession]": (prev)=>[
                        ...prev,
                        newSession
                    ]
            }["DataStoreProvider.useCallback[addSession]"]);
            setActiveSessionId(id);
            return id;
        }
    }["DataStoreProvider.useCallback[addSession]"], []);
    const setActiveSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[setActiveSession]": (id)=>{
            setActiveSessionId(id);
        }
    }["DataStoreProvider.useCallback[setActiveSession]"], []);
    const getSessionsByModule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[getSessionsByModule]": (module)=>{
            return sessions.filter({
                "DataStoreProvider.useCallback[getSessionsByModule]": (s)=>s.module === module
            }["DataStoreProvider.useCallback[getSessionsByModule]"]);
        }
    }["DataStoreProvider.useCallback[getSessionsByModule]"], [
        sessions
    ]);
    const removeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[removeSession]": (id)=>{
            setSessions({
                "DataStoreProvider.useCallback[removeSession]": (prev)=>prev.filter({
                        "DataStoreProvider.useCallback[removeSession]": (s)=>s.id !== id
                    }["DataStoreProvider.useCallback[removeSession]"])
            }["DataStoreProvider.useCallback[removeSession]"]);
            if (activeSessionId === id) {
                setActiveSessionId(null);
            }
        }
    }["DataStoreProvider.useCallback[removeSession]"], [
        activeSessionId
    ]);
    const clearAllSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[clearAllSessions]": ()=>{
            setSessions([]);
            setActiveSessionId(null);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }["DataStoreProvider.useCallback[clearAllSessions]"], []);
    const updateSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataStoreProvider.useCallback[updateSession]": (id, data)=>{
            setSessions({
                "DataStoreProvider.useCallback[updateSession]": (prev)=>prev.map({
                        "DataStoreProvider.useCallback[updateSession]": (s)=>{
                            if (s.id === id) {
                                return {
                                    ...s,
                                    ...data
                                };
                            }
                            return s;
                        }
                    }["DataStoreProvider.useCallback[updateSession]"])
            }["DataStoreProvider.useCallback[updateSession]"]);
        }
    }["DataStoreProvider.useCallback[updateSession]"], []);
    const activeSession = sessions.find((s)=>s.id === activeSessionId) || null;
    const stats = {
        totalSessions: sessions.length,
        totalRecordsProcessed: sessions.reduce((sum, s)=>sum + s.data.rows.length, 0),
        modulesUsed: [
            ...new Set(sessions.map((s)=>s.module))
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DataStoreContext.Provider, {
        value: {
            sessions,
            activeSession,
            addSession,
            setActiveSession,
            getSessionsByModule,
            removeSession,
            clearAllSessions,
            updateSession,
            stats
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/data-store.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(DataStoreProvider, "gQJhhJCu6CDWDai7KqnIR1CKUVI=");
_c = DataStoreProvider;
function useDataStore() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DataStoreContext);
    if (context === undefined) {
        throw new Error("useDataStore must be used within a DataStoreProvider");
    }
    return context;
}
_s1(useDataStore, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "DataStoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bytesToSize",
    ()=>bytesToSize,
    "capitalize",
    ()=>capitalize,
    "cn",
    ()=>cn,
    "debounce",
    ()=>debounce,
    "deepClone",
    ()=>deepClone,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatNumber",
    ()=>formatNumber,
    "generateId",
    ()=>generateId,
    "getInitials",
    ()=>getInitials,
    "getRelativeTime",
    ()=>getRelativeTime,
    "isBrowser",
    ()=>isBrowser,
    "isEmpty",
    ()=>isEmpty,
    "safeJsonParse",
    ()=>safeJsonParse,
    "sleep",
    ()=>sleep,
    "throttle",
    ()=>throttle,
    "truncate",
    ()=>truncate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatNumber(num) {
    return num.toLocaleString();
}
function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function formatDateTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function truncate(str, length) {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}
function debounce(func, wait) {
    let timeout = null;
    return (...args)=>{
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
}
function throttle(func, limit) {
    let inThrottle = false;
    return (...args)=>{
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(()=>inThrottle = false, limit);
        }
    };
}
function generateId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function getInitials(name) {
    return name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0, 2);
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    } catch  {
        return fallback;
    }
}
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function bytesToSize(bytes) {
    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"
    ];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
function isBrowser() {
    return ("TURBOPACK compile-time value", "object") !== "undefined";
}
function getRelativeTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Unknown";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    return formatDate(d);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Application Constants
__turbopack_context__.s([
    "ANALYSIS_THRESHOLDS",
    ()=>ANALYSIS_THRESHOLDS,
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "APP_CONFIG",
    ()=>APP_CONFIG,
    "COLUMN_TYPES",
    ()=>COLUMN_TYPES,
    "DATE_FORMATS",
    ()=>DATE_FORMATS,
    "EXPORT_FORMATS",
    ()=>EXPORT_FORMATS,
    "MODULES",
    ()=>MODULES,
    "OPERATOR_COLORS",
    ()=>OPERATOR_COLORS,
    "REPORT_TEMPLATES",
    ()=>REPORT_TEMPLATES,
    "THEME_CONFIG",
    ()=>THEME_CONFIG,
    "UPLOAD_CONFIG",
    ()=>UPLOAD_CONFIG,
    "VALIDATION_PATTERNS",
    ()=>VALIDATION_PATTERNS
]);
const APP_CONFIG = {
    name: "RTF Forensics Suite",
    version: "2.0.0",
    developer: "Rifat Ahmed",
    releaseDate: "2025-06-04",
    description: "Professional Telecom Forensics Analysis Platform",
    copyright: "2025 Rifat Ahmed. All rights reserved.",
    supportEmail: "support@rtfforensics.com",
    documentationUrl: "/docs"
};
const MODULES = {
    home: {
        id: "home",
        label: "Dashboard",
        description: "Overview & statistics",
        icon: "LayoutDashboard"
    },
    cdr: {
        id: "cdr",
        label: "CDR Analyzer",
        description: "Call detail records analysis",
        icon: "Phone"
    },
    tower: {
        id: "tower",
        label: "Tower Dump",
        description: "Cell tower data analysis",
        icon: "Radio"
    },
    drive: {
        id: "drive",
        label: "Drive Test",
        description: "Route and coverage analysis",
        icon: "Route"
    },
    mutual: {
        id: "mutual",
        label: "Mutual Comm",
        description: "Link and cluster analysis",
        icon: "Users"
    },
    geo: {
        id: "geo",
        label: "GEO Intelligence",
        description: "Map visualization",
        icon: "Map"
    },
    reports: {
        id: "reports",
        label: "Reports",
        description: "Generate PDF reports",
        icon: "FileText"
    }
};
const UPLOAD_CONFIG = {
    maxFileSize: 50 * 1024 * 1024,
    acceptedFormats: [
        ".csv",
        ".xlsx",
        ".xls",
        ".txt"
    ],
    maxRowsPreview: 1000,
    chunkSize: 10000,
    mimeTypes: [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain"
    ]
};
const COLUMN_TYPES = {
    PHONE_A: "Phone A",
    PHONE_B: "Phone B",
    DATETIME: "Date/Time",
    DURATION: "Duration",
    CALL_TYPE: "Call Type",
    IMEI_A: "IMEI A",
    IMEI_B: "IMEI B",
    IMSI_A: "IMSI A",
    IMSI_B: "IMSI B",
    LAC: "LAC",
    CELL_ID: "Cell ID",
    LATITUDE: "Latitude",
    LONGITUDE: "Longitude",
    AZIMUTH: "Azimuth",
    ADDRESS: "Address",
    OPERATOR: "Operator",
    NETWORK_TYPE: "Network Type",
    SMS_CONTENT: "SMS Content",
    DATA_VOLUME: "Data Volume",
    ROAMING: "Roaming",
    RECORD_ID: "Record ID",
    MCC: "MCC",
    MNC: "MNC",
    SIGNAL_STRENGTH: "Signal Strength",
    FIRST_CELL: "First Cell",
    LAST_CELL: "Last Cell",
    START_TIME: "Start Time",
    END_TIME: "End Time"
};
const ANALYSIS_THRESHOLDS = {
    coPresenceWindowMinutes: 30,
    minCallsForCluster: 3,
    highActivityThreshold: 50,
    suspiciousPatternThreshold: 10,
    maxBPartyDisplay: 100,
    minDurationForAnalysis: 1,
    towerProximityMeters: 500,
    timeWindowSeconds: 1800
};
const REPORT_TEMPLATES = {
    summary: {
        id: "summary",
        label: "Summary Report",
        description: "Overview of analysis"
    },
    detailed: {
        id: "detailed",
        label: "Detailed Report",
        description: "Full analysis with charts"
    },
    timeline: {
        id: "timeline",
        label: "Timeline Report",
        description: "Chronological events"
    },
    network: {
        id: "network",
        label: "Network Report",
        description: "Communication patterns"
    },
    tower: {
        id: "tower",
        label: "Tower Analysis",
        description: "Cell tower analysis report"
    },
    mutual: {
        id: "mutual",
        label: "Mutual Analysis",
        description: "Cross-reference analysis"
    }
};
const THEME_CONFIG = {
    defaultTheme: "dark",
    storageKey: "rtf-theme",
    themes: [
        "light",
        "dark",
        "system"
    ]
};
const DATE_FORMATS = [
    "YYYY-MM-DD HH:mm:ss",
    "DD/MM/YYYY HH:mm:ss",
    "MM/DD/YYYY HH:mm:ss",
    "DD-MM-YYYY HH:mm:ss",
    "YYYY/MM/DD HH:mm:ss",
    "DD.MM.YYYY HH:mm:ss",
    "YYYY-MM-DD",
    "DD/MM/YYYY",
    "MM/DD/YYYY"
];
const EXPORT_FORMATS = {
    pdf: {
        id: "pdf",
        label: "PDF Document",
        extension: ".pdf",
        mimeType: "application/pdf"
    },
    csv: {
        id: "csv",
        label: "CSV Spreadsheet",
        extension: ".csv",
        mimeType: "text/csv"
    },
    xlsx: {
        id: "xlsx",
        label: "Excel Workbook",
        extension: ".xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    json: {
        id: "json",
        label: "JSON Data",
        extension: ".json",
        mimeType: "application/json"
    },
    html: {
        id: "html",
        label: "HTML Report",
        extension: ".html",
        mimeType: "text/html"
    }
};
const OPERATOR_COLORS = {
    GP: "#22d3ee",
    Grameenphone: "#22d3ee",
    Robi: "#f43f5e",
    Banglalink: "#3b82f6",
    BL: "#3b82f6",
    Teletalk: "#f59e0b",
    Airtel: "#ef4444",
    default: "#6b7280"
};
const VALIDATION_PATTERNS = {
    bangladeshPhone: /^(?:\+?880|0)?1[3-9]\d{8}$/,
    imei: /^\d{14,15}$/,
    imsi: /^\d{15}$/,
    lac: /^\d{1,5}$/,
    cellId: /^\d{1,10}$/,
    mcc: /^\d{3}$/,
    mnc: /^\d{2,3}$/
};
const API_ENDPOINTS = {
    health: "/api/health",
    version: "/api/version",
    info: "/api/info"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/bangladesh-thanas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Master list of all Police Stations (Thana) in Bangladesh
// Structure: Division → District → Thana
__turbopack_context__.s([
    "bangladeshThanas",
    ()=>bangladeshThanas,
    "getAllThanas",
    ()=>getAllThanas,
    "getTotalThanaCount",
    ()=>getTotalThanaCount
]);
const bangladeshThanas = {
    "Dhaka Division": {
        "Dhaka Metropolitan": [
            "Adabor",
            "Agargaon",
            "Airport",
            "Badda",
            "Banani",
            "Bangshal",
            "Cantonment",
            "Chakbazar",
            "Dakshin Khan",
            "Darus Salam",
            "Demra",
            "Dhanmondi",
            "Uttara East",
            "Uttara West",
            "Gandaria",
            "Gulshan",
            "Hatirjheel",
            "Hazaribagh",
            "Jatrabari",
            "Kadamtali",
            "Kafrul",
            "Kalabagan",
            "Kamrangirchar",
            "Khilgaon",
            "Khilkhet",
            "Kotwali",
            "Lalbagh",
            "Mirpur",
            "Mohammadpur",
            "Motijheel",
            "Mugda",
            "New Market",
            "Pallabi",
            "Paltan",
            "Ramna",
            "Rampura",
            "Rupnagar",
            "Sabujbagh",
            "Shah Ali",
            "Shahbagh",
            "Shyampur",
            "Sher-e-Bangla Nagar",
            "Sutrapur",
            "Tejgaon",
            "Turag",
            "Vatara",
            "Wari"
        ],
        "Other Dhaka Districts": [
            "Dohar",
            "Keraniganj Model",
            "Keraniganj South",
            "Nawabganj",
            "Savar"
        ],
        Gazipur: [
            "Gazipur Sadar",
            "Kaliakair",
            "Kaliganj",
            "Kapasia",
            "Sreepur",
            "Tongi East",
            "Tongi West"
        ],
        Gopalganj: [
            "Gopalganj Sadar",
            "Kashiani",
            "Kotalipara",
            "Muksudpur",
            "Tungipara"
        ],
        Kishoreganj: [
            "Kishoreganj Sadar",
            "Austagram",
            "Bajitpur",
            "Bhairab",
            "Hossainpur",
            "Itna",
            "Karimganj",
            "Katiadi",
            "Kuliarchar",
            "Mithamain",
            "Nikli",
            "Pakundia",
            "Tarail"
        ],
        Madaripur: [
            "Madaripur Sadar",
            "Kalkini",
            "Rajoir",
            "Shibchar"
        ],
        Manikganj: [
            "Manikganj Sadar",
            "Daulatpur",
            "Ghior",
            "Harirampur",
            "Saturia",
            "Shibalaya",
            "Singair"
        ],
        Munshiganj: [
            "Munshiganj Sadar",
            "Gazaria",
            "Lauhajang",
            "Sirajdikhan",
            "Sreenagar",
            "Tongibari"
        ],
        Narayanganj: [
            "Narayanganj Sadar",
            "Araihazar",
            "Bandar",
            "Fatullah",
            "Rupganj Model",
            "Siddhirganj",
            "Sonargaon"
        ],
        Narsingdi: [
            "Narsingdi Sadar",
            "Belabo",
            "Manohardi",
            "Palash",
            "Raipura",
            "Shibpur"
        ],
        Rajbari: [
            "Rajbari Sadar",
            "Baliakandi",
            "Goalanda",
            "Pangsha",
            "Kalukhali"
        ],
        Shariatpur: [
            "Shariatpur Sadar",
            "Bhedarganj",
            "Damudya",
            "Gosairhat",
            "Naria",
            "Zajira"
        ],
        Tangail: [
            "Tangail Sadar",
            "Basail",
            "Bhuapur",
            "Delduar",
            "Dhanbari",
            "Ghatail",
            "Gopalpur",
            "Kalihati",
            "Madhupur",
            "Mirzapur",
            "Nagarpur",
            "Sakhipur"
        ]
    },
    "Chittagong Division": {
        "Chittagong Metropolitan": [
            "Akbarshah",
            "Bakolia",
            "Bandar",
            "Bayezid Bostami",
            "Chandgaon",
            "Chattogram Kotwali",
            "Double Mooring",
            "EPZ",
            "Halishahar",
            "Karnaphuli",
            "Khulshi",
            "Kotwali",
            "Pahartali",
            "Panchlaish",
            "Patenga",
            "Sadarghat"
        ],
        "Other Chittagong": [
            "Anwara",
            "Banshkhali",
            "Boalkhali",
            "Chandanaish",
            "Fatikchhari",
            "Hathazari",
            "Lohagara",
            "Mirsharai",
            "Patiya",
            "Rangunia",
            "Raozan",
            "Sandwip",
            "Satkania",
            "Sitakunda"
        ],
        Brahmanbaria: [
            "Brahmanbaria Sadar",
            "Akhaura",
            "Ashuganj",
            "Bancharampur",
            "Bijoynagar",
            "Kasba",
            "Nabinagar",
            "Nasirnagar",
            "Sarail"
        ],
        Chandpur: [
            "Chandpur Sadar",
            "Faridganj",
            "Haimchar",
            "Hajiganj",
            "Kachua",
            "Matlab North",
            "Matlab South",
            "Shahrasti"
        ],
        Comilla: [
            "Comilla Sadar South",
            "Adarsha Sadar",
            "Barura",
            "Brahmanpara",
            "Burichang",
            "Chandina",
            "Chauddagram",
            "Daudkandi",
            "Debidwar",
            "Homna",
            "Laksam",
            "Manoharganj",
            "Meghna",
            "Muradnagar",
            "Nangalkot",
            "Titas"
        ],
        "Cox's Bazar": [
            "Cox's Bazar Sadar",
            "Chakaria",
            "Kutubdia",
            "Maheshkhali",
            "Pekua",
            "Ramu",
            "Teknaf",
            "Ukhiya"
        ],
        Feni: [
            "Feni Sadar",
            "Chhagalnaiya",
            "Daganbhuiyan",
            "Fulgazi",
            "Parshuram",
            "Sonagazi"
        ],
        Lakshmipur: [
            "Lakshmipur Sadar",
            "Kamalnagar",
            "Raipur",
            "Ramganj",
            "Ramgati"
        ],
        Noakhali: [
            "Noakhali Sadar",
            "Begumganj",
            "Chatkhil",
            "Companiganj",
            "Hatiya",
            "Kabirhat",
            "Senbagh",
            "Sonaimuri",
            "Subarnachar"
        ],
        Rangamati: [
            "Rangamati Sadar",
            "Baghaichhari",
            "Barkal",
            "Belaichhari",
            "Juraichhari",
            "Kaptai",
            "Kawkhali",
            "Langadu",
            "Naniarchar",
            "Rajasthali"
        ],
        Bandarban: [
            "Bandarban Sadar",
            "Alikadam",
            "Lama",
            "Naikhongchhari",
            "Rowangchhari",
            "Ruma",
            "Thanchi"
        ],
        Khagrachhari: [
            "Khagrachhari Sadar",
            "Dighinala",
            "Lakshmichhari",
            "Mahalchhari",
            "Manikchhari",
            "Matiranga",
            "Panchhari",
            "Ramgarh"
        ]
    },
    "Rajshahi Division": {
        "Rajshahi Metropolitan": [
            "Boalia",
            "Motihar",
            "Rajpara",
            "Shah Makhdum"
        ],
        Bogra: [
            "Bogra Sadar",
            "Adamdighi",
            "Dhunat",
            "Dupchanchia",
            "Gabtali",
            "Kahalu",
            "Nandigram",
            "Sariakandi",
            "Shahjahanpur",
            "Sherpur",
            "Shibganj",
            "Sonatola"
        ],
        Joypurhat: [
            "Joypurhat Sadar",
            "Akkelpur",
            "Kalai",
            "Khetlal",
            "Panchbibi"
        ],
        Naogaon: [
            "Naogaon Sadar",
            "Atrai",
            "Badalgachhi",
            "Dhamoirhat",
            "Manda",
            "Mohadevpur",
            "Niamatpur",
            "Patnitala",
            "Porsha",
            "Raninagar",
            "Sapahar"
        ],
        Natore: [
            "Natore Sadar",
            "Bagatipara",
            "Baraigram",
            "Gurudaspur",
            "Lalpur",
            "Singra"
        ],
        Chapainawabganj: [
            "Chapainawabganj Sadar",
            "Bholahat",
            "Gomastapur",
            "Nachole",
            "Shibganj"
        ],
        Pabna: [
            "Pabna Sadar",
            "Atgharia",
            "Bera",
            "Bhangura",
            "Chatmohar",
            "Faridpur",
            "Ishwardi",
            "Santhia",
            "Sujanagar"
        ],
        Sirajganj: [
            "Sirajganj Sadar",
            "Belkuchi",
            "Chauhali",
            "Kamarkhand",
            "Kazipur",
            "Raiganj",
            "Shahjadpur",
            "Tarash",
            "Ullapara"
        ]
    },
    "Khulna Division": {
        "Khulna Metropolitan": [
            "Khulna Kotwali",
            "Sonadanga",
            "Khalishpur",
            "Daulatpur",
            "Khan Jahan Ali",
            "Aranghata",
            "Labanchara",
            "Harintana"
        ],
        Bagerhat: [
            "Bagerhat Sadar",
            "Chitalmari",
            "Fakirhat",
            "Kachua",
            "Mollahat",
            "Mongla",
            "Morrelganj",
            "Rampal",
            "Sarankhola"
        ],
        Jessore: [
            "Jessore Kotwali",
            "Abhaynagar",
            "Bagherpara",
            "Chaugachha",
            "Jhikargachha",
            "Keshabpur",
            "Manirampur",
            "Sharsha"
        ],
        Jhalokathi: [
            "Jhalokathi Sadar",
            "Kathalia",
            "Nalchity",
            "Rajapur"
        ],
        Jhenaidah: [
            "Jhenaidah Sadar",
            "Harinakunda",
            "Kaliganj",
            "Kotchandpur",
            "Maheshpur",
            "Shailkupa"
        ],
        Kushtia: [
            "Kushtia Sadar",
            "Bheramara",
            "Daulatpur",
            "Kumarkhali",
            "Khoksa",
            "Mirpur"
        ],
        Magura: [
            "Magura Sadar",
            "Mohammadpur",
            "Shalikha",
            "Sreepur"
        ],
        Meherpur: [
            "Meherpur Sadar",
            "Gangni",
            "Mujibnagar"
        ],
        Narail: [
            "Narail Sadar",
            "Kalia",
            "Lohagara"
        ],
        Satkhira: [
            "Satkhira Sadar",
            "Assasuni",
            "Debhata",
            "Kalaroa",
            "Kaliganj",
            "Shyamnagar",
            "Tala"
        ]
    },
    "Barisal Division": {
        "Barisal Metropolitan": [
            "Kotwali Model",
            "Airport",
            "Bandar",
            "Kaunia"
        ],
        "Barisal District": [
            "Agailjhara",
            "Babuganj",
            "Bakerganj",
            "Banaripara",
            "Gaurnadi",
            "Hizla",
            "Mehendiganj",
            "Muladi",
            "Uzirpur"
        ],
        Bhola: [
            "Bhola Sadar",
            "Burhanuddin",
            "Char Fasson",
            "Daulat Khan",
            "Lalmohan",
            "Manpura",
            "Tazumuddin"
        ],
        Barguna: [
            "Barguna Sadar",
            "Amtali",
            "Bamna",
            "Betagi",
            "Patharghata",
            "Taltali"
        ],
        Patuakhali: [
            "Patuakhali Sadar",
            "Bauphal",
            "Dashmina",
            "Dumki",
            "Galachipa",
            "Kalapara",
            "Mirzaganj",
            "Rangabali"
        ],
        Pirojpur: [
            "Pirojpur Sadar",
            "Bhandaria",
            "Kawkhali",
            "Mathbaria",
            "Nesarabad",
            "Nazirpur",
            "Zianagar"
        ]
    },
    "Sylhet Division": {
        "Sylhet Metropolitan": [
            "Kotwali Model",
            "Airport",
            "Dakshin Surma",
            "Moglabazar",
            "Shahporan",
            "Jalalabad"
        ],
        "Sylhet District": [
            "Balaganj",
            "Beanibazar",
            "Bishwanath",
            "Companiganj",
            "Fenchuganj",
            "Golapganj",
            "Gowainghat",
            "Jaintiapur",
            "Kanaighat",
            "Osmaninagar",
            "Zakiganj"
        ],
        Habiganj: [
            "Habiganj Sadar",
            "Ajmiriganj",
            "Bahubal",
            "Baniachong",
            "Chunarughat",
            "Lakhai",
            "Madhabpur",
            "Nabiganj"
        ],
        Moulvibazar: [
            "Moulvibazar Sadar",
            "Barlekha",
            "Juri",
            "Kamalganj",
            "Kulaura",
            "Rajnagar",
            "Sreemangal"
        ],
        Sunamganj: [
            "Sunamganj Sadar",
            "Bishwambarpur",
            "Chhatak",
            "Derai",
            "Dharmapasha",
            "Dowarabazar",
            "Jagannathpur",
            "Jamalganj",
            "Sulla",
            "Tahirpur"
        ]
    },
    "Rangpur Division": {
        "Rangpur Metropolitan": [
            "Kotwali",
            "Tajhat",
            "Haragach",
            "Gangachara",
            "Mithapukur",
            "Pirgachha",
            "Badarganj",
            "Taraganj"
        ],
        Dinajpur: [
            "Dinajpur Sadar",
            "Birampur",
            "Birganj",
            "Biral",
            "Bochaganj",
            "Chirirbandar",
            "Fulbari",
            "Ghoraghat",
            "Hakimpur",
            "Kaharole",
            "Khansama",
            "Nawabganj",
            "Parbatipur"
        ],
        Gaibandha: [
            "Gaibandha Sadar",
            "Fulchhari",
            "Gobindaganj",
            "Palashbari",
            "Sadullapur",
            "Saghata",
            "Sundarganj"
        ],
        Kurigram: [
            "Kurigram Sadar",
            "Bhurungamari",
            "Char Rajibpur",
            "Chilmari",
            "Nageshwari",
            "Phulbari",
            "Rajarhat",
            "Raumari",
            "Ulipur"
        ],
        Lalmonirhat: [
            "Lalmonirhat Sadar",
            "Aditmari",
            "Hatibandha",
            "Kaliganj",
            "Patgram"
        ],
        Nilphamari: [
            "Nilphamari Sadar",
            "Dimla",
            "Domar",
            "Jaldhaka",
            "Kishoreganj",
            "Saidpur"
        ],
        Panchagarh: [
            "Panchagarh Sadar",
            "Atwari",
            "Boda",
            "Debiganj",
            "Tetulia"
        ],
        Thakurgaon: [
            "Thakurgaon Sadar",
            "Baliadangi",
            "Haripur",
            "Pirganj",
            "Ranisankail"
        ]
    },
    "Mymensingh Division": {
        Mymensingh: [
            "Mymensingh Sadar",
            "Bhaluka",
            "Dhobaura",
            "Fulbaria",
            "Gafargaon",
            "Gouripur",
            "Haluaghat",
            "Ishwarganj",
            "Muktagachha",
            "Nandail",
            "Phulpur",
            "Trishal"
        ],
        Jamalpur: [
            "Jamalpur Sadar",
            "Bakshiganj",
            "Dewanganj",
            "Islampur",
            "Madarganj",
            "Melandaha",
            "Sarishabari"
        ],
        Netrokona: [
            "Netrokona Sadar",
            "Atpara",
            "Barhatta",
            "Durgapur",
            "Kendua",
            "Khaliajuri",
            "Kalmakanda",
            "Madan",
            "Mohanganj",
            "Purbadhala"
        ],
        Sherpur: [
            "Sherpur Sadar",
            "Jhenaigati",
            "Nakla",
            "Nalitabari",
            "Sreebardi"
        ]
    }
};
function getAllThanas() {
    const thanas = [];
    for (const [division, districts] of Object.entries(bangladeshThanas)){
        for (const [district, thanaList] of Object.entries(districts)){
            for (const thana of thanaList){
                thanas.push({
                    value: `${thana} PS, ${district}`,
                    label: `${thana} PS`,
                    division,
                    district,
                    thana
                });
            }
        }
    }
    return thanas.sort((a, b)=>a.thana.localeCompare(b.thana));
}
function getTotalThanaCount() {
    let count = 0;
    for (const districts of Object.values(bangladeshThanas)){
        for (const thanaList of Object.values(districts)){
            count += thanaList.length;
        }
    }
    return count;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/file-parser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDateTime",
    ()=>formatDateTime,
    "formatDuration",
    ()=>formatDuration,
    "formatFileSize",
    ()=>formatFileSize,
    "formatPhoneNumber",
    ()=>formatPhoneNumber,
    "isValidCoordinate",
    ()=>isValidCoordinate,
    "normalizeIMEI",
    ()=>normalizeIMEI,
    "normalizeMSISDN",
    ()=>normalizeMSISDN,
    "parseAnyDate",
    ()=>parseAnyDate,
    "parseFile",
    ()=>parseFile,
    "processBatch",
    ()=>processBatch,
    "transformRowsToCSV",
    ()=>transformRowsToCSV,
    "validateIMEI",
    ()=>validateIMEI,
    "validateIMSI",
    ()=>validateIMSI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
;
async function parseFile(file) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    let result;
    if (extension === "xlsx" || extension === "xls") {
        result = await parseExcelFile(file);
    } else {
        result = await parseTextFile(file);
    }
    result.metadata = {
        fileName: file.name,
        fileSize: file.size,
        parseDate: new Date().toISOString(),
        rowCount: result.rows.length,
        columnCount: result.headers.length
    };
    return result;
}
async function parseExcelFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](arrayBuffer, {
        type: "array"
    });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(worksheet, {
        defval: ""
    });
    if (jsonData.length === 0) {
        return {
            headers: [],
            rows: []
        };
    }
    const headers = Object.keys(jsonData[0]);
    const rows = jsonData.map((row)=>{
        const cleanRow = {};
        headers.forEach((header)=>{
            cleanRow[header] = String(row[header] ?? "").trim();
        });
        return cleanRow;
    }).filter((row)=>Object.values(row).some((v)=>v !== ""));
    const analytics = generateAnalytics(headers, rows);
    return {
        headers,
        rows,
        analytics
    };
}
async function parseTextFile(file) {
    const text = await file.text();
    const lines = text.trim().split("\n");
    if (lines.length === 0) {
        return {
            headers: [],
            rows: [],
            rawText: text
        };
    }
    const firstLine = lines[0];
    let delimiter = ",";
    if (firstLine.includes("\t")) delimiter = "\t";
    else if (firstLine.includes(";")) delimiter = ";";
    else if (firstLine.includes("|")) delimiter = "|";
    const headers = firstLine.split(delimiter).map((h)=>h.trim().replace(/^["']|["']$/g, ""));
    const rows = lines.slice(1).map((line)=>{
        const values = line.split(delimiter).map((v)=>v.trim().replace(/^["']|["']$/g, ""));
        const row = {};
        headers.forEach((header, index)=>{
            row[header] = values[index] || "";
        });
        return row;
    }).filter((row)=>Object.values(row).some((v)=>v !== ""));
    const analytics = generateAnalytics(headers, rows);
    return {
        headers,
        rows,
        analytics,
        rawText: text
    };
}
function generateAnalytics(headers, rows) {
    const analytics = {};
    const lowerHeaders = headers.map((h)=>h.toLowerCase());
    // Find MSISDN/Phone columns
    const msisdnColumn = headers.find((h, i)=>lowerHeaders[i].includes("msisdn") || lowerHeaders[i].includes("phone") || lowerHeaders[i].includes("number") || lowerHeaders[i].includes("b_party") || lowerHeaders[i].includes("b-party") || lowerHeaders[i].includes("bparty") || lowerHeaders[i].includes("called") || lowerHeaders[i].includes("calling"));
    const aPartyColumn = headers.find((h, i)=>lowerHeaders[i].includes("a_party") || lowerHeaders[i].includes("a-party") || lowerHeaders[i].includes("aparty") || lowerHeaders[i].includes("caller") || lowerHeaders[i].includes("calling"));
    if (msisdnColumn) {
        const uniqueNumbers = new Set(rows.map((r)=>r[msisdnColumn]).filter(Boolean));
        analytics.uniqueBParty = uniqueNumbers.size;
        analytics.uniqueMSISDN = uniqueNumbers.size;
        // Calculate top B-party numbers
        const bPartyCount = {};
        rows.forEach((r)=>{
            const num = r[msisdnColumn];
            if (num) {
                bPartyCount[num] = (bPartyCount[num] || 0) + 1;
            }
        });
        analytics.topBParty = Object.entries(bPartyCount).sort((a, b)=>b[1] - a[1]).slice(0, 100).map(([number, count])=>({
                number,
                count
            }));
    }
    // Find IMEI column
    const imeiColumn = headers.find((h, i)=>lowerHeaders[i].includes("imei"));
    if (imeiColumn) {
        const uniqueIMEI = new Set(rows.map((r)=>r[imeiColumn]).filter(Boolean));
        analytics.uniqueIMEI = uniqueIMEI.size;
    }
    const imsiColumn = headers.find((h, i)=>lowerHeaders[i].includes("imsi"));
    if (imsiColumn) {
        const uniqueIMSI = new Set(rows.map((r)=>r[imsiColumn]).filter(Boolean));
        analytics.uniqueIMSI = uniqueIMSI.size;
    }
    // Find LAC/CI columns for tower analysis
    const lacColumn = headers.find((h, i)=>lowerHeaders[i].includes("lac"));
    const ciColumn = headers.find((h, i)=>lowerHeaders[i].includes("ci") || lowerHeaders[i].includes("cell"));
    if (lacColumn || ciColumn) {
        const towerSet = new Set(rows.map((r)=>`${r[lacColumn || ""] || ""}-${r[ciColumn || ""] || ""}`));
        analytics.towerHits = rows.length;
        analytics.towerCount = towerSet.size;
        analytics.uniqueLocations = towerSet.size;
        const towerCounts = {};
        rows.forEach((r)=>{
            const lac = r[lacColumn || ""] || "";
            const ci = r[ciColumn || ""] || "";
            const key = `${lac}-${ci}`;
            if (!towerCounts[key]) {
                towerCounts[key] = {
                    lac,
                    ci,
                    count: 0
                };
            }
            towerCounts[key].count++;
        });
        // Find lat/lng columns for tower locations
        const latColumn = headers.find((h, i)=>lowerHeaders[i].includes("lat") || lowerHeaders[i].includes("latitude"));
        const lngColumn = headers.find((h, i)=>lowerHeaders[i].includes("lon") || lowerHeaders[i].includes("lng") || lowerHeaders[i].includes("longitude"));
        analytics.towerLocations = Object.values(towerCounts).map((t)=>{
            const row = rows.find((r)=>(r[lacColumn || ""] || "") === t.lac && (r[ciColumn || ""] || "") === t.ci);
            const lat = latColumn && row ? Number.parseFloat(row[latColumn]) || undefined : undefined;
            const lng = lngColumn && row ? Number.parseFloat(row[lngColumn]) || undefined : undefined;
            return isValidCoordinate(lat, lng) ? {
                ...t,
                lat,
                lng
            } : {
                ...t
            };
        }).sort((a, b)=>b.count - a.count).slice(0, 100);
        const totalHits = rows.length;
        analytics.topTowers = Object.values(towerCounts).sort((a, b)=>b.count - a.count).slice(0, 20).map((t)=>({
                ...t,
                percentage: Math.round(t.count / totalHits * 100 * 10) / 10
            }));
    }
    // Find time/date column
    const timeColumn = headers.find((h, i)=>lowerHeaders[i].includes("time") || lowerHeaders[i].includes("date") || lowerHeaders[i].includes("timestamp") || lowerHeaders[i].includes("start"));
    if (timeColumn && rows.length > 0) {
        const sortedRows = [
            ...rows
        ].sort((a, b)=>{
            const dateA = parseAnyDate(a[timeColumn] || "");
            const dateB = parseAnyDate(b[timeColumn] || "");
            return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
        });
        analytics.firstActivity = formatDateTime(sortedRows[0][timeColumn]);
        analytics.lastActivity = formatDateTime(sortedRows[sortedRows.length - 1][timeColumn]);
        analytics.timeSpan = `${analytics.firstActivity} - ${analytics.lastActivity}`;
        const dateGroups = {};
        const hourGroups = {};
        const weekdayGroups = {};
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        // Find call type column
        const typeCol = headers.find((h, i)=>lowerHeaders[i].includes("type") || lowerHeaders[i].includes("direction") || lowerHeaders[i].includes("call_type") || lowerHeaders[i].includes("service"));
        rows.forEach((r)=>{
            const dateStr = r[timeColumn];
            if (dateStr) {
                const date = parseAnyDate(dateStr);
                if (date) {
                    const dateKey = date.toISOString().split("T")[0];
                    const hour = date.getHours();
                    const weekday = date.getDay();
                    if (!dateGroups[dateKey]) {
                        dateGroups[dateKey] = {
                            calls: 0,
                            sms: 0,
                            data: 0
                        };
                    }
                    const type = typeCol ? r[typeCol]?.toLowerCase() || "" : "";
                    if (type.includes("sms") || type.includes("message")) {
                        dateGroups[dateKey].sms++;
                    } else if (type.includes("data") || type.includes("gprs")) {
                        dateGroups[dateKey].data++;
                    } else {
                        dateGroups[dateKey].calls++;
                    }
                    hourGroups[hour] = (hourGroups[hour] || 0) + 1;
                    weekdayGroups[weekday] = (weekdayGroups[weekday] || 0) + 1;
                }
            }
        });
        analytics.timelineData = Object.entries(dateGroups).sort((a, b)=>a[0].localeCompare(b[0])).map(([date, counts])=>({
                date,
                ...counts
            }));
        analytics.hourlyDistribution = Array.from({
            length: 24
        }, (_, hour)=>({
                hour,
                count: hourGroups[hour] || 0
            }));
        analytics.weekdayDistribution = weekdays.map((day, index)=>({
                day,
                count: weekdayGroups[index] || 0
            }));
        const peakHourEntry = Object.entries(hourGroups).sort((a, b)=>b[1] - a[1])[0];
        if (peakHourEntry) {
            analytics.peakHour = {
                hour: Number.parseInt(peakHourEntry[0]),
                count: peakHourEntry[1]
            };
        }
    }
    // Find call type column for incoming/outgoing analysis
    const typeColumn = headers.find((h, i)=>lowerHeaders[i].includes("type") || lowerHeaders[i].includes("direction") || lowerHeaders[i].includes("call_type"));
    if (typeColumn) {
        let incoming = 0;
        let outgoing = 0;
        let sms = 0;
        let unknown = 0;
        rows.forEach((r)=>{
            const type = r[typeColumn]?.toLowerCase() || "";
            if (type.includes("in") || type.includes("mt") || type.includes("received") || type.includes("terminating")) {
                incoming++;
            } else if (type.includes("out") || type.includes("mo") || type.includes("dialed") || type.includes("originating")) {
                outgoing++;
            } else {
                unknown++;
            }
            if (type.includes("sms") || type.includes("message")) {
                sms++;
            }
        });
        analytics.incomingCalls = incoming;
        analytics.outgoingCalls = outgoing;
        analytics.smsCount = sms;
        analytics.callDirections = {
            incoming,
            outgoing,
            unknown
        };
    }
    // Find duration column
    const durationColumn = headers.find((h, i)=>lowerHeaders[i].includes("duration") || lowerHeaders[i].includes("length") || lowerHeaders[i].includes("seconds"));
    if (durationColumn) {
        let totalSeconds = 0;
        let maxDuration = 0;
        let longestCallRow = null;
        rows.forEach((row)=>{
            const val = Number.parseInt(row[durationColumn]) || 0;
            totalSeconds += val;
            if (val > maxDuration) {
                maxDuration = val;
                longestCallRow = row;
            }
        });
        analytics.totalDuration = formatDuration(totalSeconds);
        analytics.totalDurationSeconds = totalSeconds;
        analytics.averageCallDuration = rows.length > 0 ? Math.round(totalSeconds / rows.length) : 0;
        if (longestCallRow && maxDuration > 0) {
            analytics.longestCall = {
                duration: maxDuration,
                bParty: msisdnColumn ? longestCallRow[msisdnColumn] || "" : "",
                date: timeColumn ? longestCallRow[timeColumn] || "" : ""
            };
        }
    } else {
        analytics.totalDuration = "N/A";
    }
    // Find provider/operator column
    const providerColumn = headers.find((h, i)=>lowerHeaders[i].includes("provider") || lowerHeaders[i].includes("operator") || lowerHeaders[i].includes("network"));
    if (providerColumn) {
        const providers = {};
        rows.forEach((r)=>{
            const provider = r[providerColumn];
            if (provider) {
                providers[provider] = (providers[provider] || 0) + 1;
            }
        });
        analytics.providers = providers;
    }
    return analytics;
}
function formatDateTime(dateStr) {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${year}-${month}-${day} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
    } catch  {
        return dateStr;
    }
}
function normalizeIMEI(imei) {
    const cleaned = imei.replace(/\D/g, "");
    if (cleaned.length === 14 || cleaned.length === 15) {
        return cleaned;
    }
    return imei;
}
function normalizeMSISDN(msisdn) {
    const cleaned = msisdn.replace(/\D/g, "");
    // Handle Bangladesh numbers
    if (cleaned.startsWith("880")) {
        return cleaned;
    } else if (cleaned.startsWith("0")) {
        return "880" + cleaned.substring(1);
    }
    return cleaned;
}
function parseAnyDate(dateStr) {
    if (!dateStr) return null;
    // Trim whitespace
    const trimmed = dateStr.trim();
    // Try standard ISO parsing first
    const standard = new Date(trimmed);
    if (!isNaN(standard.getTime()) && standard.getFullYear() > 1970) return standard;
    // DD/MM/YYYY HH:mm:ss format
    const ddmmyyyyTime = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s+(\d{1,2}):(\d{2}):?(\d{2})?/);
    if (ddmmyyyyTime) {
        const [, day, month, year, hours, minutes, seconds] = ddmmyyyyTime;
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day), Number.parseInt(hours), Number.parseInt(minutes), Number.parseInt(seconds || "0"));
    }
    // DD/MM/YYYY format
    const ddmmyyyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
    }
    // YYYY-MM-DD format
    const yyyymmdd = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (yyyymmdd) {
        const [, year, month, day] = yyyymmdd;
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
    }
    // DD.MM.YYYY format (European)
    const dotFormat = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (dotFormat) {
        const [, day, month, year] = dotFormat;
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
    }
    // DD/MM/YY format
    const ddmmyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2})(?:\s|$)/);
    if (ddmmyy) {
        const [, day, month, year] = ddmmyy;
        const fullYear = Number.parseInt(year) > 50 ? 1900 + Number.parseInt(year) : 2000 + Number.parseInt(year);
        return new Date(fullYear, Number.parseInt(month) - 1, Number.parseInt(day));
    }
    // MM/DD/YYYY format (US)
    const mmddyyyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (mmddyyyy) {
        const [, month, day, year] = mmddyyyy;
        // Only use this if the first number is 12 or less (more likely to be month)
        if (Number.parseInt(month) <= 12) {
            return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
        }
    }
    return null;
}
function isValidCoordinate(lat, lng) {
    if (lat === undefined || lng === undefined) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0);
}
function validateIMSI(imsi) {
    const cleaned = imsi.replace(/\D/g, "");
    return cleaned.length === 15;
}
function validateIMEI(imei) {
    const cleaned = imei.replace(/\D/g, "");
    return cleaned.length === 14 || cleaned.length === 15;
}
function formatPhoneNumber(phone, countryCode = "880") {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith(countryCode)) {
        return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
        return `+${countryCode}${cleaned.substring(1)}`;
    }
    return `+${countryCode}${cleaned}`;
}
function formatDuration(seconds) {
    if (seconds < 0) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}
function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
function transformRowsToCSV(headers, rows) {
    const escapeCSV = (val)=>{
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
            return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
    };
    const headerLine = headers.map(escapeCSV).join(",");
    const dataLines = rows.map((row)=>headers.map((h)=>escapeCSV(row[h] || "")).join(","));
    return [
        headerLine,
        ...dataLines
    ].join("\n");
}
function processBatch(items, batchSize, processor) {
    const results = [];
    for(let i = 0; i < items.length; i += batchSize){
        const batch = items.slice(i, i + batchSize);
        results.push(...processor(batch));
    }
    return results;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/column-mapping.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// RTF Forensics Suite - Intelligent Column Mapping Engine
// Comprehensive auto-mapping with synonym matching, pattern recognition, and confidence scoring
__turbopack_context__.s([
    "TARGET_COLUMNS",
    ()=>TARGET_COLUMNS,
    "applyMappingsToData",
    ()=>applyMappingsToData,
    "applyTemplate",
    ()=>applyTemplate,
    "autoMapColumns",
    ()=>autoMapColumns,
    "deleteTemplate",
    ()=>deleteTemplate,
    "detectDataType",
    ()=>detectDataType,
    "getMappingTemplates",
    ()=>getMappingTemplates,
    "saveMappingTemplate",
    ()=>saveMappingTemplate,
    "suggestTemplate",
    ()=>suggestTemplate,
    "validateMappedData",
    ()=>validateMappedData
]);
const TARGET_COLUMNS = {
    cdr: [
        {
            name: "Operator",
            required: false,
            description: "Telecom operator/provider name",
            aliases: [
                "Provider",
                "ProviderName",
                "Carrier",
                "TelecomCompany",
                "Network",
                "ServiceProvider",
                "Telco",
                "Company"
            ]
        },
        {
            name: "Party A",
            required: true,
            description: "Calling/source number",
            aliases: [
                "Aparty",
                "A_Party",
                "A-Party",
                "Caller",
                "Source",
                "Originator",
                "CallingNumber",
                "FromNumber",
                "MSISDN_A",
                "Calling",
                "From",
                "SourceNumber",
                "OriginatingNumber",
                "CallerID",
                "CLI"
            ]
        },
        {
            name: "Party B",
            required: true,
            description: "Called/destination number",
            aliases: [
                "Bparty",
                "B_Party",
                "B-Party",
                "Called",
                "Destination",
                "Recipient",
                "CalledNumber",
                "ToNumber",
                "MSISDN_B",
                "To",
                "Dialed",
                "DestNumber",
                "TerminatingNumber",
                "DialedNumber"
            ]
        },
        {
            name: "Start",
            required: true,
            description: "Call start date/time",
            aliases: [
                "StartTime",
                "Start_Time",
                "DateTime",
                "CallStart",
                "StartDateTime",
                "Timestamp",
                "Date",
                "Time",
                "CallDate",
                "CallDateTime"
            ]
        },
        {
            name: "End",
            required: false,
            description: "Call end date/time",
            aliases: [
                "EndTime",
                "End_Time",
                "CallEnd",
                "EndDateTime",
                "FinishTime",
                "StopTime"
            ]
        },
        {
            name: "Call Duration",
            required: false,
            description: "Duration of call in seconds",
            aliases: [
                "Duration",
                "CallTime",
                "TalkTime",
                "Seconds",
                "CallLength",
                "DurationSec",
                "TotalDuration",
                "Length",
                "Sec",
                "DurationSeconds"
            ]
        },
        {
            name: "Usage Type",
            required: false,
            description: "Type of service (Voice/SMS/Data)",
            aliases: [
                "ServiceType",
                "CallType",
                "UsageCategory",
                "Type",
                "Direction",
                "Service",
                "ActivityType",
                "Category",
                "EventType"
            ]
        },
        {
            name: "Call Direction",
            required: false,
            description: "Incoming/Outgoing direction",
            aliases: [
                "Direction",
                "CallDirection",
                "InOut",
                "IO",
                "MOC_MTC",
                "Orientation"
            ]
        },
        {
            name: "IMEI",
            required: false,
            description: "Device identifier (15 digits)",
            aliases: [
                "DeviceID",
                "Device_ID",
                "HandsetIMEI",
                "EquipmentID",
                "TAC",
                "Device",
                "Handset",
                "IMEI_A",
                "EquipmentIdentity"
            ]
        },
        {
            name: "IMEI B",
            required: false,
            description: "B-Party device identifier",
            aliases: [
                "IMEI_B",
                "DeviceID_B",
                "HandsetIMEI_B",
                "EquipmentID_B"
            ]
        },
        {
            name: "IMSI",
            required: false,
            description: "Subscriber identifier (15 digits)",
            aliases: [
                "SubscriberID",
                "Subscriber_ID",
                "SIM_ID",
                "SIMID",
                "SubscriberIdentity",
                "SIM",
                "IMSI_A"
            ]
        },
        {
            name: "IMSI B",
            required: false,
            description: "B-Party subscriber identifier",
            aliases: [
                "IMSI_B",
                "SubscriberID_B",
                "SIM_ID_B"
            ]
        },
        {
            name: "LAC",
            required: false,
            description: "Location Area Code",
            aliases: [
                "LAC_ID",
                "LAC-ID",
                "LocationAreaCode",
                "AreaCode",
                "LA",
                "Location_Area",
                "LAC_A"
            ]
        },
        {
            name: "LAC B",
            required: false,
            description: "B-Party Location Area Code",
            aliases: [
                "LAC_B",
                "LAC_ID_B",
                "LocationAreaCode_B"
            ]
        },
        {
            name: "Cell ID",
            required: false,
            description: "Cell tower identifier",
            aliases: [
                "CI",
                "CellIdentifier",
                "Cell_ID",
                "CID",
                "CGI",
                "CellSite",
                "TowerID",
                "Cell",
                "CellNo",
                "CI_A"
            ]
        },
        {
            name: "Cell ID B",
            required: false,
            description: "B-Party Cell tower identifier",
            aliases: [
                "CI_B",
                "CellIdentifier_B",
                "Cell_ID_B",
                "CID_B"
            ]
        },
        {
            name: "Bts Address",
            required: false,
            description: "Tower location/address",
            aliases: [
                "Address",
                "Location",
                "SiteAddress",
                "TowerAddress",
                "CellAddress",
                "SiteName",
                "BTSLocation",
                "Site",
                "Tower",
                "CellLocation"
            ]
        },
        {
            name: "Latitude",
            required: false,
            description: "GPS latitude coordinate",
            aliases: [
                "Lat",
                "GPS_Lat",
                "GeoLat",
                "Y_Coord",
                "Y",
                "Lat_A"
            ]
        },
        {
            name: "Longitude",
            required: false,
            description: "GPS longitude coordinate",
            aliases: [
                "Long",
                "Lng",
                "GPS_Long",
                "GeoLong",
                "X_Coord",
                "X",
                "Lon",
                "Long_A"
            ]
        },
        {
            name: "Latitude B",
            required: false,
            description: "B-Party GPS latitude",
            aliases: [
                "Lat_B",
                "GPS_Lat_B",
                "GeoLat_B"
            ]
        },
        {
            name: "Longitude B",
            required: false,
            description: "B-Party GPS longitude",
            aliases: [
                "Long_B",
                "Lng_B",
                "GPS_Long_B",
                "GeoLong_B"
            ]
        },
        {
            name: "Azimuth",
            required: false,
            description: "Cell tower azimuth/direction",
            aliases: [
                "Bearing",
                "Direction",
                "Angle",
                "CellAzimuth",
                "TowerAzimuth"
            ]
        },
        {
            name: "First Cell",
            required: false,
            description: "First cell during call",
            aliases: [
                "FirstCI",
                "StartCell",
                "OriginatingCell",
                "InitialCell"
            ]
        },
        {
            name: "Last Cell",
            required: false,
            description: "Last cell during call",
            aliases: [
                "LastCI",
                "EndCell",
                "TerminatingCell",
                "FinalCell"
            ]
        },
        {
            name: "Roaming",
            required: false,
            description: "Roaming indicator",
            aliases: [
                "IsRoaming",
                "RoamingStatus",
                "Roamer",
                "RoamingFlag"
            ]
        },
        {
            name: "Network Type",
            required: false,
            description: "Network technology (2G/3G/4G/5G)",
            aliases: [
                "Technology",
                "RAT",
                "RadioAccessType",
                "NetworkTech",
                "2G3G4G"
            ]
        },
        {
            name: "SMS Content",
            required: false,
            description: "SMS message content",
            aliases: [
                "Message",
                "SMSText",
                "MessageContent",
                "Text",
                "Content"
            ]
        },
        {
            name: "Data Volume",
            required: false,
            description: "Data usage in bytes/KB/MB",
            aliases: [
                "DataUsage",
                "Volume",
                "Bytes",
                "DataBytes",
                "DownloadVolume",
                "UploadVolume",
                "TotalVolume"
            ]
        },
        {
            name: "Record ID",
            required: false,
            description: "Unique record identifier",
            aliases: [
                "ID",
                "RecordNo",
                "SequenceNo",
                "SerialNo",
                "TransactionID",
                "CDR_ID"
            ]
        }
    ],
    tower: [
        {
            name: "MSISDN",
            required: true,
            description: "Mobile number",
            aliases: [
                "PhoneNumber",
                "Phone",
                "Number",
                "Mobile",
                "MobileNumber",
                "Subscriber",
                "MSISDN_No",
                "PartyA"
            ]
        },
        {
            name: "IMEI",
            required: false,
            description: "Device identifier (15 digits)",
            aliases: [
                "DeviceID",
                "Device_ID",
                "HandsetIMEI",
                "EquipmentID",
                "TAC",
                "Device"
            ]
        },
        {
            name: "IMSI",
            required: false,
            description: "Subscriber identifier (15 digits)",
            aliases: [
                "SubscriberID",
                "Subscriber_ID",
                "SIM_ID",
                "SIMID",
                "SIM"
            ]
        },
        {
            name: "DateTime",
            required: true,
            description: "Activity timestamp",
            aliases: [
                "Timestamp",
                "Date",
                "Time",
                "Start",
                "ActivityTime",
                "EventTime",
                "RecordTime"
            ]
        },
        {
            name: "LAC",
            required: true,
            description: "Location Area Code",
            aliases: [
                "LAC_ID",
                "LAC-ID",
                "LocationAreaCode",
                "AreaCode",
                "LA"
            ]
        },
        {
            name: "Cell ID",
            required: true,
            description: "Cell identifier",
            aliases: [
                "CI",
                "CellIdentifier",
                "Cell_ID",
                "CID",
                "CGI",
                "TowerID"
            ]
        },
        {
            name: "Bts Address",
            required: false,
            description: "Tower location/address",
            aliases: [
                "Address",
                "Location",
                "SiteAddress",
                "TowerAddress",
                "SiteName"
            ]
        },
        {
            name: "Latitude",
            required: false,
            description: "GPS latitude coordinate",
            aliases: [
                "Lat",
                "GPS_Lat",
                "GeoLat",
                "Y_Coord"
            ]
        },
        {
            name: "Longitude",
            required: false,
            description: "GPS longitude coordinate",
            aliases: [
                "Long",
                "Lng",
                "GPS_Long",
                "GeoLong",
                "X_Coord",
                "Lon"
            ]
        },
        {
            name: "Azimuth",
            required: false,
            description: "Cell tower azimuth/direction",
            aliases: [
                "Bearing",
                "Direction",
                "Angle",
                "CellAzimuth"
            ]
        },
        {
            name: "Event Type",
            required: false,
            description: "Type of event (Call/SMS/Data)",
            aliases: [
                "Type",
                "ActivityType",
                "UsageType",
                "ServiceType"
            ]
        },
        {
            name: "Duration",
            required: false,
            description: "Event duration in seconds",
            aliases: [
                "Seconds",
                "Length",
                "TalkTime",
                "CallDuration"
            ]
        },
        {
            name: "Operator",
            required: false,
            description: "Network operator",
            aliases: [
                "Provider",
                "Network",
                "Carrier",
                "Telco"
            ]
        }
    ]
};
const SYNONYM_MAP = {
    operator: [
        "provider",
        "providername",
        "carrier",
        "telecomcompany",
        "network",
        "serviceprovider",
        "telco",
        "company",
        "networkoperator"
    ],
    "party a": [
        "aparty",
        "a_party",
        "a-party",
        "caller",
        "source",
        "originator",
        "callingnumber",
        "fromnumber",
        "msisdn_a",
        "calling",
        "from",
        "sourcenumber",
        "originatingnumber",
        "callerid",
        "cli",
        "anumber"
    ],
    "party b": [
        "bparty",
        "b_party",
        "b-party",
        "called",
        "destination",
        "recipient",
        "callednumber",
        "tonumber",
        "msisdn_b",
        "to",
        "dialed",
        "destnumber",
        "terminatingnumber",
        "dialednumber",
        "bnumber"
    ],
    start: [
        "starttime",
        "start_time",
        "datetime",
        "callstart",
        "startdatetime",
        "timestamp",
        "date",
        "time",
        "calldate",
        "calltime",
        "eventtime",
        "recordtime",
        "activitytime"
    ],
    end: [
        "endtime",
        "end_time",
        "callend",
        "enddatetime",
        "finishtime",
        "stoptime"
    ],
    "call duration": [
        "duration",
        "calltime",
        "talktime",
        "seconds",
        "calllength",
        "durationsec",
        "totalduration",
        "length",
        "sec",
        "durationseconds",
        "billedseconds"
    ],
    "call direction": [
        "direction",
        "calldirection",
        "inout",
        "io",
        "moc_mtc",
        "orientation",
        "callorientation"
    ],
    "usage type": [
        "servicetype",
        "calltype",
        "usagecategory",
        "type",
        "direction",
        "service",
        "activitytype",
        "category",
        "eventtype"
    ],
    imei: [
        "deviceid",
        "device_id",
        "handsetimei",
        "equipmentid",
        "tac",
        "device",
        "handset",
        "imei_a",
        "equipmentidentity"
    ],
    "imei b": [
        "imei_b",
        "deviceid_b",
        "handsetimei_b",
        "equipmentid_b"
    ],
    imsi: [
        "subscriberid",
        "subscriber_id",
        "sim_id",
        "simid",
        "subscriberidentity",
        "sim",
        "imsi_a"
    ],
    "imsi b": [
        "imsi_b",
        "subscriberid_b",
        "sim_id_b"
    ],
    lac: [
        "lac_id",
        "lac-id",
        "locationareacode",
        "areacode",
        "la",
        "location_area",
        "lac_a"
    ],
    "lac b": [
        "lac_b",
        "lac_id_b",
        "locationareacode_b"
    ],
    "cell id": [
        "ci",
        "cellidentifier",
        "cell_id",
        "cid",
        "cgi",
        "cellsite",
        "towerid",
        "cell",
        "cellno",
        "ci_a"
    ],
    "cell id b": [
        "ci_b",
        "cellidentifier_b",
        "cell_id_b",
        "cid_b"
    ],
    "bts address": [
        "address",
        "location",
        "siteaddress",
        "toweraddress",
        "celladdress",
        "sitename",
        "btslocation",
        "site",
        "tower",
        "celllocation",
        "towersite"
    ],
    latitude: [
        "lat",
        "gps_lat",
        "geolat",
        "y_coord",
        "y",
        "lat_a"
    ],
    longitude: [
        "long",
        "lng",
        "gps_long",
        "geolong",
        "x_coord",
        "x",
        "lon",
        "long_a"
    ],
    "latitude b": [
        "lat_b",
        "gps_lat_b",
        "geolat_b"
    ],
    "longitude b": [
        "long_b",
        "lng_b",
        "gps_long_b",
        "geolong_b"
    ],
    azimuth: [
        "bearing",
        "direction",
        "angle",
        "cellazimuth",
        "towerazimuth",
        "sectorangle"
    ],
    "first cell": [
        "firstci",
        "startcell",
        "originatingcell",
        "initialcell"
    ],
    "last cell": [
        "lastci",
        "endcell",
        "terminatingcell",
        "finalcell"
    ],
    roaming: [
        "isroaming",
        "roamingstatus",
        "roamer",
        "roamingflag"
    ],
    "network type": [
        "technology",
        "rat",
        "radioaccesstype",
        "networktech",
        "2g3g4g",
        "accesstechnology"
    ],
    "sms content": [
        "message",
        "smstext",
        "messagecontent",
        "text",
        "content"
    ],
    "data volume": [
        "datausage",
        "volume",
        "bytes",
        "databytes",
        "downloadvolume",
        "uploadvolume",
        "totalvolume"
    ],
    "record id": [
        "id",
        "recordno",
        "sequenceno",
        "serialno",
        "transactionid",
        "cdr_id"
    ],
    msisdn: [
        "phonenumber",
        "phone",
        "number",
        "mobile",
        "mobilenumber",
        "subscriber",
        "msisdn_no",
        "partya"
    ]
};
const PATTERN_RULES = [
    {
        pattern: /^(start|begin|call).*(date|time)/i,
        targetColumn: "Start"
    },
    {
        pattern: /^(date|time|timestamp)/i,
        targetColumn: "Start"
    },
    {
        pattern: /^(end|stop|finish).*(date|time)/i,
        targetColumn: "End"
    },
    {
        pattern: /(duration|length|seconds|sec)/i,
        targetColumn: "Call Duration"
    },
    {
        pattern: /^imei$/i,
        targetColumn: "IMEI"
    },
    {
        pattern: /^imei.?b/i,
        targetColumn: "IMEI B"
    },
    {
        pattern: /^imsi$/i,
        targetColumn: "IMSI"
    },
    {
        pattern: /^imsi.?b/i,
        targetColumn: "IMSI B"
    },
    {
        pattern: /^(lac|location.*area)/i,
        targetColumn: "LAC"
    },
    {
        pattern: /^lac.?b/i,
        targetColumn: "LAC B"
    },
    {
        pattern: /^(cell|ci|cid|cgi)$/i,
        targetColumn: "Cell ID"
    },
    {
        pattern: /^(cell|ci|cid).?b/i,
        targetColumn: "Cell ID B"
    },
    {
        pattern: /(address|location|site|tower|bts)/i,
        targetColumn: "Bts Address"
    },
    {
        pattern: /^(lat|latitude)$/i,
        targetColumn: "Latitude"
    },
    {
        pattern: /^(lat|latitude).?b/i,
        targetColumn: "Latitude B"
    },
    {
        pattern: /^(lon|lng|long|longitude)$/i,
        targetColumn: "Longitude"
    },
    {
        pattern: /^(lon|lng|long|longitude).?b/i,
        targetColumn: "Longitude B"
    },
    {
        pattern: /(operator|provider|carrier|network|telco)/i,
        targetColumn: "Operator"
    },
    {
        pattern: /(type|category|service)/i,
        targetColumn: "Usage Type"
    },
    {
        pattern: /(direction|inout|moc|mtc)/i,
        targetColumn: "Call Direction"
    },
    {
        pattern: /(azimuth|bearing|angle)/i,
        targetColumn: "Azimuth"
    },
    {
        pattern: /(roam)/i,
        targetColumn: "Roaming"
    },
    {
        pattern: /(first.*cell|start.*cell)/i,
        targetColumn: "First Cell"
    },
    {
        pattern: /(last.*cell|end.*cell)/i,
        targetColumn: "Last Cell"
    },
    {
        pattern: /(sms|message|content)/i,
        targetColumn: "SMS Content"
    },
    {
        pattern: /(data.*volume|volume|bytes|usage)/i,
        targetColumn: "Data Volume"
    },
    {
        pattern: /^(id|record.*id|transaction)/i,
        targetColumn: "Record ID"
    }
];
function detectDataType(values) {
    const nonEmptyValues = values.filter((v)=>v && v.trim() !== "").slice(0, 50);
    if (nonEmptyValues.length === 0) return "text";
    // Check for IMEI (15 digits)
    const imeiPattern = /^\d{15}$/;
    if (nonEmptyValues.every((v)=>imeiPattern.test(v.replace(/[-\s]/g, "")))) {
        return "imei";
    }
    // Check for IMSI (15 digits, often starts with country code)
    const imsiPattern = /^\d{15}$/;
    if (nonEmptyValues.every((v)=>imsiPattern.test(v.replace(/[-\s]/g, "")))) {
        return "imsi";
    }
    // Check for coordinates (latitude/longitude)
    const coordPattern = /^-?\d{1,3}\.\d{4,}$/;
    if (nonEmptyValues.filter((v)=>coordPattern.test(v)).length > nonEmptyValues.length * 0.7) {
        return "coordinates";
    }
    // Check for phone numbers (10-15 digits, may have + or country code)
    const phonePattern = /^[+]?[\d\s\-()]{10,18}$/;
    if (nonEmptyValues.filter((v)=>phonePattern.test(v)).length > nonEmptyValues.length * 0.7) {
        return "phone";
    }
    // Check for dates
    const datePatterns = [
        /^\d{4}[-/]\d{2}[-/]\d{2}/,
        /^\d{2}[-/]\d{2}[-/]\d{4}/,
        /^\d{2}[-/]\d{2}[-/]\d{2}/
    ];
    if (nonEmptyValues.some((v)=>datePatterns.some((p)=>p.test(v)))) {
        return "date";
    }
    // Check for time
    const timePattern = /^\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$/i;
    if (nonEmptyValues.filter((v)=>timePattern.test(v)).length > nonEmptyValues.length * 0.7) {
        return "time";
    }
    // Check for numbers
    const numberPattern = /^-?[\d,]+\.?\d*$/;
    if (nonEmptyValues.filter((v)=>numberPattern.test(v.replace(/,/g, ""))).length > nonEmptyValues.length * 0.8) {
        return "number";
    }
    return "text";
}
// Normalize column name for comparison
function normalizeColumnName(name) {
    return name.toLowerCase().replace(/[\s_\-.]+/g, " ").replace(/[^a-z0-9\s]/g, "").trim();
}
// Calculate string similarity (Levenshtein-based)
function calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;
    const matrix = [];
    for(let i = 0; i <= s1.length; i++){
        matrix[i] = [
            i
        ];
    }
    for(let j = 0; j <= s2.length; j++){
        matrix[0][j] = j;
    }
    for(let i = 1; i <= s1.length; i++){
        for(let j = 1; j <= s2.length; j++){
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    const maxLen = Math.max(s1.length, s2.length);
    return 1 - matrix[s1.length][s2.length] / maxLen;
}
function autoMapColumns(sourceColumns, sampleData, moduleType = "cdr") {
    const targetCols = TARGET_COLUMNS[moduleType];
    const mappings = [];
    const usedTargets = new Set();
    for (const sourceCol of sourceColumns){
        const normalizedSource = normalizeColumnName(sourceCol);
        const sampleValues = sampleData.slice(0, 10).map((row)=>row[sourceCol] || "");
        const dataType = detectDataType(sampleValues);
        let bestMatch = {
            sourceColumn: sourceCol,
            targetColumn: "",
            confidence: 0,
            matchType: "none",
            sampleData: sampleValues.slice(0, 3),
            dataType
        };
        for (const target of targetCols){
            if (usedTargets.has(target.name)) continue;
            const normalizedTarget = normalizeColumnName(target.name);
            let confidence = 0;
            let matchType = "none";
            // 1. Exact match (highest priority)
            if (normalizedSource === normalizedTarget) {
                confidence = 100;
                matchType = "exact";
            } else {
                const synonyms = SYNONYM_MAP[normalizedTarget] || [];
                const allSynonyms = [
                    normalizedTarget,
                    ...synonyms,
                    ...target.aliases?.map((a)=>normalizeColumnName(a)) || []
                ];
                if (allSynonyms.some((syn)=>normalizedSource === syn || normalizedSource.includes(syn) || syn.includes(normalizedSource))) {
                    confidence = 90;
                    matchType = "synonym";
                } else {
                    for (const rule of PATTERN_RULES){
                        if (rule.targetColumn === target.name && rule.pattern.test(sourceCol)) {
                            confidence = 80;
                            matchType = "pattern";
                            break;
                        }
                    }
                }
                // 4. Fuzzy match
                if (matchType === "none") {
                    const similarity = calculateSimilarity(normalizedSource, normalizedTarget);
                    if (similarity > 0.7) {
                        confidence = Math.round(similarity * 70);
                        matchType = "fuzzy";
                    }
                }
            }
            // Data type validation boost/penalty
            if (confidence > 0) {
                if (target.name === "IMEI" && dataType === "imei") confidence = Math.min(100, confidence + 10);
                if (target.name === "IMSI" && dataType === "imsi") confidence = Math.min(100, confidence + 10);
                if (target.name === "Start" && (dataType === "date" || dataType === "time")) confidence = Math.min(100, confidence + 5);
                if (target.name === "End" && (dataType === "date" || dataType === "time")) confidence = Math.min(100, confidence + 5);
                if (target.name === "Call Duration" && dataType === "number") confidence = Math.min(100, confidence + 5);
                if ((target.name === "Party A" || target.name === "Party B") && dataType === "phone") confidence = Math.min(100, confidence + 5);
                if ((target.name === "Latitude" || target.name === "Longitude") && dataType === "coordinates") confidence = Math.min(100, confidence + 10);
                if ((target.name === "Latitude B" || target.name === "Longitude B") && dataType === "coordinates") confidence = Math.min(100, confidence + 10);
            }
            if (confidence > bestMatch.confidence) {
                bestMatch = {
                    sourceColumn: sourceCol,
                    targetColumn: target.name,
                    confidence,
                    matchType,
                    sampleData: sampleValues.slice(0, 3),
                    dataType
                };
            }
        }
        if (bestMatch.confidence >= 50) {
            usedTargets.add(bestMatch.targetColumn);
        }
        mappings.push(bestMatch);
    }
    return mappings;
}
function validateMappedData(data, mappings, moduleType = "cdr") {
    const errors = [];
    const warnings = [];
    const targetCols = TARGET_COLUMNS[moduleType];
    // Check required columns
    const requiredCols = targetCols.filter((c)=>c.required);
    for (const reqCol of requiredCols){
        const mapping = mappings.find((m)=>m.targetColumn === reqCol.name && m.confidence > 0);
        if (!mapping) {
            errors.push({
                column: reqCol.name,
                message: `Required column "${reqCol.name}" is not mapped`,
                severity: "error"
            });
        }
    }
    // Validate IMEI format
    const imeiMapping = mappings.find((m)=>m.targetColumn === "IMEI" && m.confidence > 0);
    if (imeiMapping) {
        let invalidCount = 0;
        data.forEach((row, idx)=>{
            const val = row[imeiMapping.sourceColumn]?.replace(/[-\s]/g, "");
            if (val && !/^\d{14,15}$/.test(val)) {
                invalidCount++;
                if (invalidCount <= 3) {
                    errors.push({
                        column: "IMEI",
                        row: idx + 1,
                        message: `Invalid IMEI format: "${val}" (must be 14-15 digits)`,
                        severity: "warning"
                    });
                }
            }
        });
        if (invalidCount > 3) {
            warnings.push({
                column: "IMEI",
                message: `${invalidCount} rows have invalid IMEI format`,
                affectedRows: invalidCount
            });
        }
    }
    // Validate IMSI format
    const imsiMapping = mappings.find((m)=>m.targetColumn === "IMSI" && m.confidence > 0);
    if (imsiMapping) {
        let invalidCount = 0;
        data.forEach((row)=>{
            const val = row[imsiMapping.sourceColumn]?.replace(/[-\s]/g, "");
            if (val && !/^\d{15}$/.test(val)) {
                invalidCount++;
            }
        });
        if (invalidCount > 0) {
            warnings.push({
                column: "IMSI",
                message: `${invalidCount} rows have invalid IMSI format`,
                affectedRows: invalidCount
            });
        }
    }
    // Check for duplicate mappings
    const targetCounts = {};
    mappings.forEach((m)=>{
        if (m.targetColumn && m.confidence > 0) {
            targetCounts[m.targetColumn] = (targetCounts[m.targetColumn] || 0) + 1;
        }
    });
    for (const [target, count] of Object.entries(targetCounts)){
        if (count > 1) {
            errors.push({
                column: target,
                message: `Column "${target}" is mapped multiple times`,
                severity: "error"
            });
        }
    }
    return {
        isValid: errors.filter((e)=>e.severity === "error").length === 0,
        errors,
        warnings
    };
}
function saveMappingTemplate(template) {
    const templates = getMappingTemplates();
    const newTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
    };
    templates.push(newTemplate);
    localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates));
    return newTemplate;
}
function getMappingTemplates() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem("rtf_mapping_templates");
        return stored ? JSON.parse(stored) : [];
    } catch  {
        return [];
    }
}
function deleteTemplate(templateId) {
    const templates = getMappingTemplates().filter((t)=>t.id !== templateId);
    localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates));
}
function applyTemplate(templateId, sourceColumns) {
    const templates = getMappingTemplates();
    const template = templates.find((t)=>t.id === templateId);
    if (!template) return null;
    // Update usage count
    template.usageCount++;
    template.updatedAt = new Date().toISOString();
    localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates));
    // Apply template mappings to current source columns
    return sourceColumns.map((sourceCol)=>{
        const templateMapping = template.mappings.find((m)=>normalizeColumnName(m.sourceColumn) === normalizeColumnName(sourceCol));
        if (templateMapping) {
            return {
                ...templateMapping,
                sourceColumn: sourceCol,
                matchType: "manual"
            };
        }
        return {
            sourceColumn: sourceCol,
            targetColumn: "",
            confidence: 0,
            matchType: "none"
        };
    });
}
function suggestTemplate(sourceColumns) {
    const templates = getMappingTemplates();
    let bestMatch = null;
    for (const template of templates){
        const templateCols = template.mappings.map((m)=>normalizeColumnName(m.sourceColumn));
        const sourceCols = sourceColumns.map((c)=>normalizeColumnName(c));
        let matchCount = 0;
        for (const col of sourceCols){
            if (templateCols.some((tc)=>tc === col || calculateSimilarity(tc, col) > 0.8)) {
                matchCount++;
            }
        }
        const score = matchCount / Math.max(templateCols.length, sourceCols.length);
        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = {
                template,
                score
            };
        }
    }
    return bestMatch?.template || null;
}
function applyMappingsToData(data, mappings) {
    return data.map((row)=>{
        const newRow = {};
        for (const mapping of mappings){
            if (mapping.targetColumn && mapping.confidence > 0) {
                newRow[mapping.targetColumn] = row[mapping.sourceColumn] || "";
            }
        }
        // Keep unmapped columns with original names
        for (const key of Object.keys(row)){
            const mapping = mappings.find((m)=>m.sourceColumn === key);
            if (!mapping || mapping.confidence === 0 || !mapping.targetColumn) {
                newRow[key] = row[key];
            }
        }
        return newRow;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/report-generator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Report Generator Library for RTF Forensics Suite
// Supports PDF, Excel, CSV, and HTML export formats
__turbopack_context__.s([
    "exportModuleData",
    ()=>exportModuleData,
    "exportReport",
    ()=>exportReport
]);
// Utility to escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
// Format date for display
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    } catch  {
        return dateStr;
    }
}
// Generate HTML report
function generateHTMLReport(config, data) {
    const { caseInfo, selectedReports, includeTables, includeSummary } = config;
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTF Forensics Report${caseInfo.caseNumber ? ` - Case ${caseInfo.caseNumber}` : ""}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: #f8fafc; 
      color: #1e293b;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { 
      background: linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%); 
      color: white; 
      padding: 40px; 
      border-radius: 16px;
      margin-bottom: 32px;
      box-shadow: 0 10px 40px rgba(8, 145, 178, 0.2);
    }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .header .subtitle { opacity: 0.9; font-size: 16px; }
    .case-info { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 24px; 
      background: white; 
      padding: 24px; 
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .case-info-item label { 
      display: block; 
      font-size: 12px; 
      color: #64748b; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .case-info-item span { font-weight: 600; color: #0f172a; }
    .section { 
      background: white; 
      border-radius: 12px; 
      padding: 24px; 
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .section h2 { 
      font-size: 18px; 
      color: #0891b2; 
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card { 
      background: #f1f5f9; 
      padding: 16px; 
      border-radius: 8px;
      text-align: center;
    }
    .stat-card .value { 
      font-size: 24px; 
      font-weight: 700; 
      color: #0891b2;
    }
    .stat-card .label { 
      font-size: 12px; 
      color: #64748b;
      margin-top: 4px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 16px;
      font-size: 13px;
    }
    th, td { 
      padding: 12px 16px; 
      text-align: left; 
      border-bottom: 1px solid #e2e8f0;
    }
    th { 
      background: #f8fafc; 
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    tr:hover { background: #f8fafc; }
    .footer { 
      text-align: center; 
      padding: 24px; 
      color: #94a3b8; 
      font-size: 12px;
    }
    .notes { 
      background: #fef3c7; 
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 16px;
    }
    .notes h3 { color: #92400e; font-size: 14px; margin-bottom: 8px; }
    .notes p { color: #78350f; font-size: 14px; }
    @media print {
      body { background: white; }
      .container { padding: 0; }
      .section { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RTF Forensics Analysis Report</h1>
      <div class="subtitle">Generated on ${formatDate(new Date().toISOString())}</div>
    </div>
    
    <div class="case-info">
      <div class="case-info-item">
        <label>Case Number</label>
        <span>${escapeHtml(caseInfo.caseNumber) || "Not Specified"}</span>
      </div>
      <div class="case-info-item">
        <label>Investigator</label>
        <span>${escapeHtml(caseInfo.investigator) || "Not Specified"}</span>
      </div>
      <div class="case-info-item">
        <label>Report Date</label>
        <span>${formatDate(caseInfo.date)}</span>
      </div>
      <div class="case-info-item">
        <label>Report Types</label>
        <span>${selectedReports.map((r)=>r.toUpperCase()).join(", ")}</span>
      </div>
    </div>
    
    ${caseInfo.notes ? `
    <div class="notes">
      <h3>Notes & Remarks</h3>
      <p>${escapeHtml(caseInfo.notes)}</p>
    </div>
    ` : ""}
`;
    // CDR Report Section
    if (selectedReports.includes("cdr") && data.cdr) {
        const cdrData = data.cdr;
        html += `
    <div class="section">
      <h2>CDR Analysis Report</h2>
      ${includeSummary ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${cdrData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.uniqueBParty?.toLocaleString() || 0}</div>
          <div class="label">Unique B-Party</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.incomingCalls?.toLocaleString() || 0}</div>
          <div class="label">Incoming Calls</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.outgoingCalls?.toLocaleString() || 0}</div>
          <div class="label">Outgoing Calls</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.smsCount?.toLocaleString() || 0}</div>
          <div class="label">SMS Messages</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.towerHits?.toLocaleString() || 0}</div>
          <div class="label">Tower Hits</div>
        </div>
      </div>
      ` : ""}
      
      ${includeTables && cdrData.analytics?.topBParty ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Top 20 B-Party Numbers</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Phone Number</th>
            <th>Call Count</th>
          </tr>
        </thead>
        <tbody>
          ${cdrData.analytics.topBParty.slice(0, 20).map((item, index)=>`
          <tr>
            <td>${index + 1}</td>
            <td style="font-family: monospace;">${escapeHtml(item.number)}</td>
            <td>${item.count}</td>
          </tr>
          `).join("")}
        </tbody>
      </table>
      ` : ""}
    </div>
`;
    }
    // Tower Dump Report Section
    if (selectedReports.includes("tower") && data.tower) {
        const towerData = data.tower;
        html += `
    <div class="section">
      <h2>Tower Dump Analysis Report</h2>
      ${includeSummary ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${towerData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueIMSI?.toLocaleString() || 0}</div>
          <div class="label">Unique IMSI</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueIMEI?.toLocaleString() || 0}</div>
          <div class="label">Unique IMEI</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueMSISDN?.toLocaleString() || 0}</div>
          <div class="label">Unique MSISDN</div>
        </div>
      </div>
      ` : ""}
      
      ${includeTables && towerData.rows?.length > 0 ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Sample Records (First 50)</h3>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              ${towerData.headers?.slice(0, 8).map((h)=>`<th>${escapeHtml(h)}</th>`).join("") || ""}
            </tr>
          </thead>
          <tbody>
            ${towerData.rows.slice(0, 50).map((row)=>`
            <tr>
              ${towerData.headers?.slice(0, 8).map((h)=>`<td>${escapeHtml(String(row[h] || ""))}</td>`).join("") || ""}
            </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      ` : ""}
    </div>
`;
    }
    // Drive Test Report Section
    if (selectedReports.includes("drive") && data.drive) {
        const driveData = data.drive;
        html += `
    <div class="section">
      <h2>Drive Test Analysis Report</h2>
      ${includeSummary ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${driveData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Points</div>
        </div>
        <div class="stat-card">
          <div class="value">${driveData.analytics?.uniqueTowers?.toLocaleString() || 0}</div>
          <div class="label">Unique Towers</div>
        </div>
        <div class="stat-card">
          <div class="value">${driveData.analytics?.avgSignal?.toFixed(1) || "N/A"}</div>
          <div class="label">Avg Signal (dBm)</div>
        </div>
      </div>
      ` : ""}
    </div>
`;
    }
    // Mutual Analysis Report Section
    if (selectedReports.includes("mutual") && data.mutual) {
        const mutualData = data.mutual;
        html += `
    <div class="section">
      <h2>Mutual Communication Analysis Report</h2>
      ${includeSummary ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${mutualData.commonNumbers?.length?.toLocaleString() || 0}</div>
          <div class="label">Common Numbers</div>
        </div>
        <div class="stat-card">
          <div class="value">${mutualData.file1Records?.toLocaleString() || 0}</div>
          <div class="label">File 1 Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${mutualData.file2Records?.toLocaleString() || 0}</div>
          <div class="label">File 2 Records</div>
        </div>
      </div>
      ` : ""}
      
      ${includeTables && mutualData.commonNumbers?.length > 0 ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Common Numbers Found</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Phone Number</th>
            <th>File 1 Count</th>
            <th>File 2 Count</th>
          </tr>
        </thead>
        <tbody>
          ${mutualData.commonNumbers.slice(0, 50).map((item, index)=>`
          <tr>
            <td>${index + 1}</td>
            <td style="font-family: monospace;">${escapeHtml(item.number)}</td>
            <td>${item.file1Count || 0}</td>
            <td>${item.file2Count || 0}</td>
          </tr>
          `).join("")}
        </tbody>
      </table>
      ` : ""}
    </div>
`;
    }
    html += `
    <div class="footer">
      <p>Generated by RTF Forensics Suite</p>
      <p>This report is confidential and intended for authorized personnel only.</p>
    </div>
  </div>
</body>
</html>
`;
    return html;
}
// Generate CSV content
function generateCSVReport(config, data) {
    const lines = [];
    const { selectedReports } = config;
    // Helper to escape CSV values
    const escapeCSV = (val)=>{
        const str = String(val ?? "");
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    // Add header info
    lines.push("RTF Forensics Report");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Case Number: ${config.caseInfo.caseNumber || "N/A"}`);
    lines.push(`Investigator: ${config.caseInfo.investigator || "N/A"}`);
    lines.push("");
    // CDR Data
    if (selectedReports.includes("cdr") && data.cdr?.rows?.length > 0) {
        lines.push("=== CDR ANALYSIS ===");
        lines.push(`Total Records: ${data.cdr.rows.length}`);
        lines.push("");
        // Headers
        if (data.cdr.headers) {
            lines.push(data.cdr.headers.map(escapeCSV).join(","));
        }
        // Data rows
        data.cdr.rows.forEach((row)=>{
            const values = data.cdr.headers.map((h)=>escapeCSV(row[h]));
            lines.push(values.join(","));
        });
        lines.push("");
    }
    // Tower Data
    if (selectedReports.includes("tower") && data.tower?.rows?.length > 0) {
        lines.push("=== TOWER DUMP ANALYSIS ===");
        lines.push(`Total Records: ${data.tower.rows.length}`);
        lines.push("");
        if (data.tower.headers) {
            lines.push(data.tower.headers.map(escapeCSV).join(","));
        }
        data.tower.rows.forEach((row)=>{
            const values = data.tower.headers.map((h)=>escapeCSV(row[h]));
            lines.push(values.join(","));
        });
        lines.push("");
    }
    // Mutual Analysis Data
    if (selectedReports.includes("mutual") && data.mutual?.commonNumbers?.length > 0) {
        lines.push("=== MUTUAL COMMUNICATION ANALYSIS ===");
        lines.push(`Common Numbers Found: ${data.mutual.commonNumbers.length}`);
        lines.push("");
        lines.push("Number,File1Count,File2Count");
        data.mutual.commonNumbers.forEach((item)=>{
            lines.push(`${escapeCSV(item.number)},${item.file1Count || 0},${item.file2Count || 0}`);
        });
    }
    return lines.join("\n");
}
// Generate Excel-compatible XML (Excel 2003 XML format)
function generateExcelReport(config, data) {
    const { selectedReports, caseInfo } = config;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="11"/>
      <Interior ss:Color="#0891b2" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF"/>
    </Style>
    <Style ss:ID="Title">
      <Font ss:Bold="1" ss:Size="14"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:Size="11" ss:Color="#666666"/>
    </Style>
  </Styles>
`;
    // Summary Sheet
    xml += `
  <Worksheet ss:Name="Summary">
    <Table>
      <Row><Cell ss:StyleID="Title"><Data ss:Type="String">RTF Forensics Analysis Report</Data></Cell></Row>
      <Row><Cell ss:StyleID="SubTitle"><Data ss:Type="String">Generated: ${new Date().toISOString()}</Data></Cell></Row>
      <Row></Row>
      <Row><Cell><Data ss:Type="String">Case Number:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.caseNumber || "N/A"}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Investigator:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.investigator || "N/A"}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Report Date:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.date}</Data></Cell></Row>
      <Row></Row>
      <Row><Cell ss:StyleID="Header"><Data ss:Type="String">Module</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Records</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Status</Data></Cell></Row>
`;
    if (selectedReports.includes("cdr")) {
        xml += `<Row><Cell><Data ss:Type="String">CDR Analysis</Data></Cell><Cell><Data ss:Type="Number">${data.cdr?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.cdr ? "Included" : "No Data"}</Data></Cell></Row>`;
    }
    if (selectedReports.includes("tower")) {
        xml += `<Row><Cell><Data ss:Type="String">Tower Dump</Data></Cell><Cell><Data ss:Type="Number">${data.tower?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.tower ? "Included" : "No Data"}</Data></Cell></Row>`;
    }
    if (selectedReports.includes("mutual")) {
        xml += `<Row><Cell><Data ss:Type="String">Mutual Analysis</Data></Cell><Cell><Data ss:Type="Number">${data.mutual?.commonNumbers?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.mutual ? "Included" : "No Data"}</Data></Cell></Row>`;
    }
    if (selectedReports.includes("drive")) {
        xml += `<Row><Cell><Data ss:Type="String">Drive Test</Data></Cell><Cell><Data ss:Type="Number">${data.drive?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.drive ? "Included" : "No Data"}</Data></Cell></Row>`;
    }
    xml += `
    </Table>
  </Worksheet>
`;
    // CDR Data Sheet
    if (selectedReports.includes("cdr") && data.cdr?.rows?.length > 0) {
        xml += `
  <Worksheet ss:Name="CDR Data">
    <Table>
      <Row>
        ${data.cdr.headers.map((h)=>`<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("")}
      </Row>
`;
        data.cdr.rows.slice(0, 10000).forEach((row)=>{
            xml += `<Row>${data.cdr.headers.map((h)=>`<Cell><Data ss:Type="String">${String(row[h] ?? "").replace(/[<>&]/g, "")}</Data></Cell>`).join("")}</Row>\n`;
        });
        xml += `
    </Table>
  </Worksheet>
`;
    }
    // Tower Data Sheet
    if (selectedReports.includes("tower") && data.tower?.rows?.length > 0) {
        xml += `
  <Worksheet ss:Name="Tower Data">
    <Table>
      <Row>
        ${data.tower.headers.map((h)=>`<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("")}
      </Row>
`;
        data.tower.rows.slice(0, 10000).forEach((row)=>{
            xml += `<Row>${data.tower.headers.map((h)=>`<Cell><Data ss:Type="String">${String(row[h] ?? "").replace(/[<>&]/g, "")}</Data></Cell>`).join("")}</Row>\n`;
        });
        xml += `
    </Table>
  </Worksheet>
`;
    }
    // Mutual Analysis Sheet
    if (selectedReports.includes("mutual") && data.mutual?.commonNumbers?.length > 0) {
        xml += `
  <Worksheet ss:Name="Mutual Analysis">
    <Table>
      <Row>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Number</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">File 1 Count</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">File 2 Count</Data></Cell>
      </Row>
`;
        data.mutual.commonNumbers.forEach((item)=>{
            xml += `<Row><Cell><Data ss:Type="String">${item.number}</Data></Cell><Cell><Data ss:Type="Number">${item.file1Count || 0}</Data></Cell><Cell><Data ss:Type="Number">${item.file2Count || 0}</Data></Cell></Row>\n`;
        });
        xml += `
    </Table>
  </Worksheet>
`;
    }
    xml += `</Workbook>`;
    return xml;
}
// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([
        content
    ], {
        type: mimeType
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// Open HTML in new window for printing
function openHTMLForPrint(html) {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        // Delay print to ensure content is loaded
        setTimeout(()=>{
            printWindow.print();
        }, 500);
    }
}
function exportReport(config, data) {
    try {
        const { selectedFormat, caseInfo } = config;
        const timestamp = new Date().toISOString().slice(0, 10);
        const casePrefix = caseInfo.caseNumber ? `${caseInfo.caseNumber}_` : "";
        switch(selectedFormat){
            case "pdf":
                // Generate HTML and open print dialog for PDF
                const pdfHtml = generateHTMLReport(config, data);
                openHTMLForPrint(pdfHtml);
                return {
                    success: true,
                    message: "PDF print dialog opened. Use your browser's print function to save as PDF."
                };
            case "html":
                const html = generateHTMLReport(config, data);
                downloadFile(html, `${casePrefix}RTF_Report_${timestamp}.html`, "text/html");
                return {
                    success: true,
                    message: "HTML report downloaded successfully."
                };
            case "csv":
                const csv = generateCSVReport(config, data);
                downloadFile(csv, `${casePrefix}RTF_Report_${timestamp}.csv`, "text/csv");
                return {
                    success: true,
                    message: "CSV report downloaded successfully."
                };
            case "excel":
                const excel = generateExcelReport(config, data);
                downloadFile(excel, `${casePrefix}RTF_Report_${timestamp}.xml`, "application/vnd.ms-excel");
                return {
                    success: true,
                    message: "Excel report downloaded. Open with Microsoft Excel or compatible software."
                };
            default:
                return {
                    success: false,
                    message: `Unknown format: ${selectedFormat}`
                };
        }
    } catch (error) {
        console.error("Report generation error:", error);
        return {
            success: false,
            message: `Failed to generate report: ${error instanceof Error ? error.message : "Unknown error"}`
        };
    }
}
function exportModuleData(moduleType, data, format) {
    const config = {
        selectedReports: [
            moduleType
        ],
        selectedFormat: format,
        caseInfo: {
            caseNumber: "",
            investigator: "",
            date: new Date().toISOString().split("T")[0],
            notes: ""
        },
        includeCharts: true,
        includeMaps: false,
        includeTables: true,
        includeSummary: true
    };
    const reportData = {};
    switch(moduleType){
        case "cdr":
            reportData.cdr = data;
            break;
        case "tower":
            reportData.tower = data;
            break;
        case "drive":
            reportData.drive = data;
            break;
        case "mutual":
            reportData.mutual = data;
            break;
        case "geo":
            reportData.geo = data;
            break;
    }
    return exportReport(config, reportData);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_5b8df721._.js.map