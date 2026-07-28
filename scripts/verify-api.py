#!/usr/bin/env python3
import urllib.request, json, sys

BASE = "http://localhost:8899"
passed = 0
failed = 0

def test(name, fn):
    global passed, failed
    try:
        fn()
        print(f"  [PASS] {name}")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")
        failed += 1

def api(method, path, data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(BASE + path, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = json.loads(e.read())
        return {"status": e.code, "detail": body.get("detail", str(body))}

print("\n" + "=" * 60)
print("  NOVA ADMIN — PRODUCTION API VERIFICATION")
print("=" * 60)

# 13. Login
login = api("POST", "/auth/login", {"username": "admin", "password": "admin123"})
admin_token = login.get("token") or ""
test("Super Admin login returns token", lambda: (_ for _ in ()).throw(Exception("No token")) if not admin_token else None)

user = login.get("user", {})
test("User has username", lambda: (_ for _ in ()).throw(Exception("No username")) if not user.get("username") else None)
test("Role is super_admin", lambda: (_ for _ in ()).throw(Exception(f"Got {user.get('role')}")) if user.get("role") != "super_admin" else None)

perms = len(user.get("permissions", []))
test("Has 21 permissions", lambda: (_ for _ in ()).throw(Exception(f"Got {perms}")) if perms != 21 else None)

# 14. Refresh token
refresh_token = login.get("refreshToken") or ""
refresh = api("POST", "/auth/refresh", {"refreshToken": refresh_token})
test("Refresh token returns new token", lambda: (_ for _ in ()).throw(Exception("No token")) if not refresh.get("token") else None)

# 15. Logout & re-login
logout = api("POST", "/auth/logout", token=admin_token)
test("Logout succeeds", lambda: (_ for _ in ()).throw(Exception(str(logout))) if logout.get("message") != "Logged out successfully" else None)

login2 = api("POST", "/auth/login", {"username": "admin", "password": "admin123"})
tk2 = login2.get("token") or ""

# Me endpoint
me = api("GET", "/auth/me", token=tk2)
test("GET /auth/me returns profile", lambda: (_ for _ in ()).throw(Exception("No response")) if not me.get("username") else None)

# Admin check
admin_check = api("GET", "/auth/admin/check", token=tk2)
test("Super Admin can access /admin/check", lambda: (_ for _ in ()).throw(Exception(str(admin_check))) if admin_check.get("status") != "ok" else None)

# Master login + RBAC
master = api("POST", "/auth/login", {"username": "master", "password": "master123"})
mt = master.get("token") or ""
muser = master.get("user", {})
mperms = len(muser.get("permissions", []))
test("Master has >= 9 permissions", lambda: (_ for _ in ()).throw(Exception(f"Got {mperms}")) if mperms < 9 else None)

admin_denied = api("GET", "/auth/admin/check", token=mt)
test("Master denied admin access (403)", lambda: (_ for _ in ()).throw(Exception(f"Got {admin_denied.get('status')} != 403")) if admin_denied.get("status") != 403 else None)

# Sessions
sessions = api("GET", "/auth/sessions", token=tk2)
test("Sessions endpoint returns data", lambda: (_ for _ in ()).throw(Exception("Empty")) if len(sessions) < 1 else None)

print("\n" + "=" * 60)
print(f"  RESULTS: {passed}/{passed + failed} tests passed")
if failed > 0:
    print(f"  {failed} TEST(S) FAILED!")
    sys.exit(1)
else:
    print("  ALL TESTS PASSED! ✅")
print("=" * 60)
