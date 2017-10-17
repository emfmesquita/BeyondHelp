import React, { Component } from 'react';
import { Well } from 'react-bootstrap';
import './App.css';
import MonsterList from './MonsterList';
import MonsterData from './data/MonsterData';
import MonsterMetadata from './data/MonsterMetadata';
import MonsterListData from './data/MonsterListData';
import StorageService from './services/StorageService';
import BadgeService from './services/BadgeService';
import MonsterMenuButton from './monsterbuttons/MonsterMenuButton';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            activeList: null
        }
        this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
        this.buildList = this.buildList.bind(this);
        this.mainContent = this.mainContent.bind(this);
        StorageService.getMonsterLists().then(lists => {
            const activeList = lists.find(list => list.active);
            this.setState({ lists, activeList });
        }).catch(error => { throw error });
    }

    handleRemoveMonster(toDeleteMonster: MonsterData) {
        const toDeleteId = toDeleteMonster.storageId;
        StorageService.deleteMonster(toDeleteMonster).then(() => {
            this.setState((prevState) => {
                prevState.activeList.metadatas.forEach((metadata, metaIndex) => {
                    metadata.monsters.forEach((monster, monsterIndex) => {
                        if (monster.storageId !== toDeleteId) return;
                        metadata.monsters.splice(monsterIndex, 1);
                        if (metadata.monsters.length === 0) prevState.activeList.metadatas.splice(metaIndex, 1);
                    });
                });
                return { activeList: prevState.activeList };
            });
            BadgeService.updateBadgeCount();
        });
    }

    buildList() {
        const list: MonsterListData = this.state.activeList;
        if (!list) return "";
        return list.metadatas.map((metadata, index) => {
            const id = metadata.monsterId;
            const last = (list.metadatas.length - 1) === index;
            return (
                <li className={last ? "Monster-list-last" : ""} key={id}>
                    <MonsterList metadata={metadata} onRemoveMonster={this.handleRemoveMonster} />
                </li>
            );
        });
    }

    mainContent() {
        const list: MonsterListData = this.state.activeList;
        if (!list) return <span></span>;
        if (list.metadatas && list.metadatas.length > 0) return <ul>{this.buildList()}</ul>;

        const goblin = <a href="#">Goblin</a>;
        const mList = <a href="#">Monsters Listing</a>;
        const mHomebrew = <a href="#">Homebrew Monsters Listing</a>;
        const hCollection = <a href="#">Homebrew Collection</a>;
        const hCreation = <a href="#">Homebrew Creations</a>;

        return (
            <Well className="Monster-empty-list">
                <p>No monsters added. Try to add a {goblin}. Monsters can also be added from the expanded details of {mList}, {mHomebrew}, {hCollection} and {hCreation}.</p>
            </Well>
        );
    }

    render() {
        return (
            <div>
                {/* <div style={{padding: "4px"}}>
                    <MonsterMenuButton icon="glyphicon-plus" title="Expand All"/>
                    <MonsterMenuButton icon="glyphicon-minus" title="Collapse All"/>
                </div> */}
                {this.mainContent()}
            </div>
        );
    }
}

export default App;
