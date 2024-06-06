import com.example.auctionsite.model.AuctionRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionRoomRepository extends JpaRepository<AuctionRoom, Long> {
}

