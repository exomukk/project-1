import com.example.auctionsite.model.AuctionRoom;
import com.example.auctionsite.repository.AuctionRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionRoomService {

    @Autowired
    private AuctionRoomRepository auctionRoomRepository;

    public AuctionRoom createAuctionRoom(AuctionRoom auctionRoom) {
        return auctionRoomRepository.save(auctionRoom);
    }

    public List<AuctionRoom> getAllAuctionRooms() {
        return auctionRoomRepository.findAll();
    }

    public AuctionRoom getAuctionRoomById(Long id) {
        return auctionRoomRepository.findById(id).orElse(null);
    }
}

