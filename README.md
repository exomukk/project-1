# OOP Bee

- Java 11
- IDE: IntelliJ

---------------------
Cho 3 loại ong khác nhau là: ong thợ (Worker bee), ong chúa (Queen) và ong đực (Drone). 
Mỗi con ong ban đầu có sức khỏe (health) mặc định là 100. 
- Xây dựng phương thức damage() lấy ngẫu nhiên một số nguyên từ 0 đến 100. Khi phương thức này được gọi ở mỗi con ong thì sức khỏe (health) sẽ bị giảm theo số ngẫu nhiên vừa tạo ra.
- Khi sức khỏe của ong thợ < 70 thì nó sẽ chết (dead). Ong chúa sẽ chết nếu sức khỏe < 20 và ong đực sẽ chết nếu sức khỏe dưới 50. Sống (alive) hoặc chết (dead) là một thuộc tính của mỗi con ong. Khi ong đã chết thì sức khỏe sẽ không bị giảm mặc dù vẫn gọi đến phương thức damage().

Hãy tạo ra một chương trình có một tập hợp ngẫu nhiên 10 con ong có cả 3 loại ong trên. Hiển thị thông tin số thứ tự, loại ong (style), sức khỏe (health) và trạng thái (status) là sống (alive) hay đã chết (dead).


