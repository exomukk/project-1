import com.example.auctionsite.model.AuctionRoom;
import com.example.auctionsite.service.AuctionRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctionRooms")
public class AuctionRoomController {

    @Autowired
    private AuctionRoomService auctionRoomService;

    @PostMapping
    public AuctionRoom createAuctionRoom(@RequestBody AuctionRoom auctionRoom) {
        return auctionRoomService.createAuctionRoom(auctionRoom);
    }

    @GetMapping
    public List<AuctionRoom> getAllAuctionRooms() {
        return auctionRoomService.getAllAuctionRooms();
    }

    @GetMapping("/{id}")
    public AuctionRoom getAuctionRoomById(@PathVariable Long id) {
        return auctionRoomService.getAuctionRoomById(id);
    }
}

