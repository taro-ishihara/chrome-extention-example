import { useState, ChangeEvent, useEffect } from "react";
import { debounce } from "lodash";
import { exportToQuizlet } from "./export-to-quizlet";
import {
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  CloseButton
} from "@chakra-ui/react";
import "./App.css";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [dict, setDict] = useState({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getApiKey = async () => {
      const value = (await chrome.storage.sync.get("openAiApiKey"))[
        "openAiApiKey"
      ];
      setApiKey(value);
    };
    getApiKey();

    const getDict = async () => {
      const value = await chrome.storage.sync.get(null);
      delete value.openAiApiKey;
      setDict(value);
    };
    getDict();
  }, []);

  const handleApiKeyChangeDebounced = debounce((value: string) => {
    chrome.storage.sync.set({ openAiApiKey: value });
  }, 500);

  const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setApiKey(value);
    handleApiKeyChangeDebounced(value);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(exportToQuizlet(dict))
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const handleDeleteClick = async () => {
    try {
      const apiKey = (await chrome.storage.sync.get("openAiApiKey"))[
        "openAiApiKey"
      ];
      await chrome.storage.sync.clear();
      setDeleteSuccess(true);
      await chrome.storage.sync.set({ openAiApiKey: apiKey });
      setTimeout(() => setDeleteSuccess(false), 2000);
      setDict({});
    } catch (error) {
      console.log("Failed to delete dictionary: ", error);
    }
  };

  const handleHideClick = () => {
    setShow(!show);
  };

  const deleteWord = async(word: string) => {
    await chrome.storage.sync.remove(word);
    const updatedDict: Record<string, any> = { ...dict };
    delete updatedDict[word];
    setDict(updatedDict)
  }

  return (
    <div className="App">
      <Heading>Learning Booster with AI</Heading>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="OpenAI Secret API key"
          onChange={handleApiKeyChange}
          value={apiKey}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleHideClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>単語・表現</Th>
              <Th>説明</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(dict).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td whiteSpace="normal">{String(value)}</Td>
                <Td><CloseButton onClick={() => deleteWord(key)} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ul></ul>
      <Flex>
        <Button colorScheme="teal" variant="solid" onClick={handleCopyClick}>
          {copySuccess ? "コピー済" : "Quizlet形式でコピー"}
        </Button>
        <Button colorScheme="red" variant="outline" onClick={handleDeleteClick}>
          {deleteSuccess ? "削除済" : "辞書を全て削除"}
        </Button>
      </Flex>
    </div>
  );
}

export default App;
