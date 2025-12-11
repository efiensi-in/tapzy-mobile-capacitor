package id.tapzy.guardian;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Set solid black navigation bar and status bar
        window.setNavigationBarColor(0xFF000000);
        window.setStatusBarColor(0xFF000000);

        // Disable edge-to-edge (no transparent bars)
        WindowCompat.setDecorFitsSystemWindows(window, true);

        // Light icons on dark background
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        controller.setAppearanceLightNavigationBars(false);
        controller.setAppearanceLightStatusBars(false);
    }
}
