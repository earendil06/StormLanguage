package com.pastorm.accessors;

import com.storm.model.Block;

import java.util.List;
import java.util.Optional;

public interface Accessor {
    Optional<Block> getBlockByName(String blockName);

    String saveBlock(String blockName, String block);

    List getBlockList();
}
