/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 */
public class DoricActivity extends AppCompatActivity {
    protected DoricFragment mDoricFragment;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.doric_activity);
        if (savedInstanceState == null) {
            mDoricFragment = DoricFragment.newInstance(getSource(), getAlias(), getExtra());
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.container, mDoricFragment)
                    .commit();
        }
    }

    /**
     * @return Scheme for DoricFragment to load.
     */
    protected String getSource() {
        return getIntent().getStringExtra("source");
    }

    /**
     * @return Alias used for JS error message.
     */
    protected String getAlias() {
        return getIntent().getStringExtra("alias");
    }

    /**
     * @return Extra data used for JS Panel in JSON format.
     */
    protected String getExtra() {
        return getIntent().getStringExtra("extra");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        int requestIndex = requestCode >> 16;
        if (requestIndex == 0 && mDoricFragment != null) {
            mDoricFragment.onActivityResult(requestCode, resultCode, data);
        }
    }
}
