Để ứng dụng hoạt động tốt nhất và không bị lỗi, bạn hãy áp dụng quy tắc **"Cần gì thì khai nấy"** dựa trên 3 nhóm trường hợp bắt buộc sau đây:

---

## 1. Các trường hợp BẮT BUỘC phải có `"use client"` (Nếu không sẽ BỊ LỖI)

Bạn phải đặt `"use client"` ở đầu file `.tsx` nếu file đó chứa bất kỳ yếu tố nào sau đây:

### Nhóm 1: Sử dụng React Hooks (Quản lý trạng thái & Vòng đời)

Bất kỳ file nào có chứa chữ `use...` từ React để quản lý dữ liệu thay đổi trên giao diện:

* `useState` (lưu trạng thái dữ liệu).
* `useEffect` (gọi API sau khi page load, lắng nghe sự kiện).
* `useContext`, `useReducer`, `useRef`, `useMemo`, `useCallback`.

### Nhóm 2: Sử dụng các sự kiện tương tác của người dùng (Event Listeners)

Các hàm bắt sự kiện tương tác trực tiếp bằng chuột/bàn phím từ trình duyệt:

* `onClick={...}` (bấm nút).
* `onChange={...}` (gõ chữ vào ô input, chọn select-option).
* `onSubmit={...}` (gửi form).
* `onScroll={...}`, `onMouseEnter={...}`, `onKeyDown={...}`.

### Nhóm 3: Sử dụng các biến môi trường chỉ có ở Trình duyệt (Browser APIs)

Server (Node.js) không có màn hình, nên nếu code của bạn đụng vào các biến toàn cục của trình duyệt, nó sẽ báo lỗi `undefined` ngay trên server. Do đó phải dùng `"use client"` khi dùng:

* `window` (ví dụ: `window.innerWidth`, `window.scrollTo`).
* `document` (ví dụ: `document.getElementById`).
* `localStorage` hoặc `sessionStorage` (để lưu token, theme sáng/tối của user).

### Nhóm 4: Sử dụng Hooks điều hướng (Navigation) của Next.js

Khi bạn cần lấy thông tin URL hiện tại để xử lý logic trên giao diện:

* `useRouter()` (để chuyển trang: `router.push()`).
* `usePathname()` (lấy đường dẫn hiện tại).
* `useSearchParams()` (lấy các tham số như `?search=abc`).

---

## 2. Các trường hợp NÊN đặt `"use client"` để ứng dụng "Hoạt động tốt" (Tối ưu hóa)

Có những trường hợp không hẳn là bị lỗi, nhưng bạn **nên** chủ động tách chúng ra thành file `.tsx` riêng và cài `"use client"` để app chạy mượt và tối ưu chuẩn Next.js:

* **File chứa các UI component tương tác động (Interactive Components):** * Ví dụ: File làm nút Dropdown menu, file làm thanh Slider chạy ảnh, file làm cửa sổ Modal/Popup, file làm thanh Tab chuyển đổi qua lại.
* *Lời khuyên:* Đừng để các component này chung với file `page.tsx` lớn. Hãy tách chúng ra thành `Dropdown.tsx`, `Slider.tsx`, ghi `"use client"` ở đầu các file nhỏ đó.


* **File chứa thư viện bên thứ ba (Third-party libraries) chưa hỗ trợ Server Component:**
* Nếu bạn import một thư viện tạo biểu đồ (như `Recharts`), thư viện hiệu ứng (như `Framer Motion`), hoặc trình soạn thảo văn bản (như `ReactQuill`) vào một file, file đó thường phải là `"use client"` vì các thư viện này cần tương tác với DOM của trình duyệt để vẽ giao diện.



---

## 3. Tóm tắt bằng sơ đồ tư duy trực quan

Để dễ nhớ nhất khi code, bạn hãy tự đặt câu hỏi này trước khi viết một file `.tsx`:

* **CÓ** đụng vào Hooks, Event, Browser API, hoặc Dynamic UI? $\rightarrow$ **Đặt `"use client"**`.
* **KHÔNG** đụng vào những thứ trên (chỉ hiển thị text, ảnh, css, lấy data từ database)? $\rightarrow$ **KHÔNG đặt gì cả** (để mặc định là Server Component nhằm tối ưu SEO và tốc độ).

Bạn đã nắm được bộ quy tắc này chưa? Nếu bạn đang phân vân một file cụ thể nào đó trong project của mình có cần `"use client"` hay không, hãy gửi đoạn code đó lên đây, tôi sẽ check giúp bạn ngay!